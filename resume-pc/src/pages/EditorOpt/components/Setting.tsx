import { getResumeGroupList, updateResumeGroup } from '@/api/ResumeGroup';
import { createTemplate, getTemplateInfo, updateTemplate } from '@/api/Template';
import { uploadFile } from '@/api/Upload';
import AccessAdmin from '@/components/AccessAdmin';
import { defaultResumeTags } from '@/constants/template-data';
import { ResumeDataContext } from '@/context';
import { groupIconObj } from '@/pages/Content/components/Group';
import { SettingTwo } from '@icon-park/react';
import { Button, Dropdown, Form, Input, MenuProps, message, Modal, Select } from 'antd';
import type { SelectProps } from 'antd';
import * as htmlToImage from 'html-to-image';
import React, { useCallback, useContext, useEffect } from 'react';
import { useSetState } from 'ahooks';

const { Option } = Select;

type GroupTypeItem = {
  type: string;
  resumeId: number;
};

type StateType = {
  openTmp: boolean;
  openGroup: boolean;
  tags: string[];
  activeGroup: number;
  groupList: API.ResumeGroupItem[];
  type: string;
  types: GroupTypeItem[];
};
export default () => {
  const [form] = Form.useForm();
  const options: SelectProps['options'] = defaultResumeTags;
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const [state, setState] = useSetState<StateType>({
    openTmp: false,
    openGroup: false,
    tags: [],
    groupList: [],
    activeGroup: 0,
    type: '',
    types: [],
  });

  const values = Form.useWatch([], form);

  useEffect(() => {
    const name = form.getFieldValue('name');
    state.groupList.forEach((g, index) => {
      if (name === g.name) {
        setState({ activeGroup: index });
      }
    });
  }, [form, values]);

  const htmlToJpeg = (callback: (url: string) => void) => {
    setTimeout(() => {
      const el: any = document.getElementById('preview-block');
      htmlToImage.toJpeg(el, { quality: 0.8 }).then(async (dataUrl) => {
        const bytes = window.atob(dataUrl.split(',')[1]);

        const array = [];
        for (let i = 0; i < bytes.length; i++) {
          array.push(bytes.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('file', blob, 'template.jpeg');
        formData.append('folder', 'images');
        const res = await uploadFile(formData);
        if (res.success) {
          callback(res.data.url);
        }
      });
    });
  };

  const getTemplateData = () => {
    getTemplateInfo({ code: resumeData.templateCode }).then((res) => {
      setState({ tags: res.data.tags });
    });
  };

  const getGroupList = () => {
    getResumeGroupList().then((res) => {
      if (res.success) {
        const groupList = res.data;
        setState({ groupList });
        for (let i = 0; i < groupList.length; i++) {
          const group = groupList[i];
          for (let j = 0; j < group.types.length; j++) {
            const t = group.types[j];
            if (t.resumeId === +resumeData.id) {
              setState({
                activeGroup: i,
                types: group.types as GroupTypeItem[],
                type: t.type,
              });
              form.setFieldsValue({
                name: group.name,
                icon: group.icon,
                sort: group.sort,
                type: t.type,
              });
              break;
            }
          }
        }
      }
    });
  };
  const createNewTemplate = (url: string) => {
    createTemplate({
      code: resumeData.templateCode,
      title: resumeData.title,
      headerImg: url,
      tags: state.tags,
      content: resumeData.content,
    }).then((res) => {
      if (res.success) {
        message.success('创建成功');
      }
    });
  };

  const updateCurrentTemplate = useCallback(
    (url: string) => {
      updateTemplate(
        { code: resumeData.templateCode },
        {
          title: resumeData.title,
          headerImg: url,
          tags: state.tags,
          content: resumeData.content,
        },
      ).then((res) => {
        if (res.success) {
          message.success('更新成功');
          setState({ openTmp: false });
        }
      });
    },
    [resumeData, state],
  );

  const adminItems: MenuProps['items'] = [
    {
      label: '保存为新模板',
      key: 'new',
      onClick: () => htmlToJpeg(createNewTemplate),
    },
    {
      label: '更新当前模板',
      key: 'update',
      onClick: () => {
        getTemplateData();
        setState({ openTmp: true });
      },
    },
    {
      label: '设为内容模板',
      key: 'data',
      onClick: () => {
        setState({ openGroup: true });
        getGroupList();
      },
    },
  ];

  const handleOk = () => {
    htmlToJpeg(updateCurrentTemplate);
  };

  const onFinish = () => {
    form.validateFields().then((val) => {
      const types = state.groupList[state.activeGroup].types;
      types.forEach((t: GroupTypeItem) => {
        if (t.type === val.type) {
          t.resumeId = +resumeData.id;
        }
      });
      resumeData.dataTmp = 1;
      updateResume(resumeData);
      updateResumeGroup({
        id: state.groupList[state.activeGroup].id,
        icon: val.icon,
        name: val.name,
        types: types as GroupTypeItem[],
        sort: +val.sort,
      }).then((res) => {
        if (res.success) {
          message.success('更新成功');
          form.resetFields();
          setState({ openGroup: false });
        }
      });
    });
  };

  return (
    <AccessAdmin>
      <div className={'py-3'}>
        <Dropdown menu={{ items: adminItems }} trigger={['click']} placement={'top'} arrow={{ pointAtCenter: true }}>
          <Button block className={'p-[2px]'} icon={<SettingTwo size={18} />}>
            设置
          </Button>
        </Dropdown>
        <Modal
          title="请选择模板标签"
          width={420}
          open={state.openTmp}
          onOk={handleOk}
          onCancel={() => setState({ openTmp: false })}
        >
          <div>
            <Select
              value={state.tags}
              mode="tags"
              onChange={(val) => setState({ tags: val })}
              style={{ width: '100%' }}
              placeholder="设置模板标签"
              options={options}
            />
          </div>
        </Modal>
        <Modal
          title="设置内容模板"
          width={420}
          open={state.openGroup}
          onOk={onFinish}
          onCancel={() => setState({ openGroup: false })}
        >
          <div className={'pt-5'}>
            <Form form={form} variant="filled" style={{ maxWidth: 600 }}>
              <Form.Item name="name" label="分组" rules={[{ required: true }]}>
                <Select placeholder="选择分类">
                  {state.groupList.map((op) => (
                    <Option key={op.id} value={op.name}>
                      {op.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="type" label="分类" rules={[{ required: true }]}>
                <Select placeholder="选择分类">
                  {state.groupList[state.activeGroup]?.types?.map((t: GroupTypeItem) => {
                    return (
                      <Option key={t.type} value={t.type}>
                        {t.type}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="icon" label="Icon" rules={[{ required: true }]}>
                <Select placeholder="选择分类">
                  {Object.keys(groupIconObj).map((g) => {
                    return (
                      <Option key={g} value={g}>
                        {g}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="sort" label="排序" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </AccessAdmin>
  );
};
