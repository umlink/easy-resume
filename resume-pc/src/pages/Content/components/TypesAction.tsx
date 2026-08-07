import { createResume } from '@/api/Resume';
import AccessAdmin from '@/components/AccessAdmin';
import { subThemeColor } from '@/constants';
import Template from '@/pages/EditorOpt/components/Template';
import { history } from '@@/core/history';
import { DoubleRight, SettingTwo, Theme } from '@icon-park/react';
import { useModel, useRequest } from '@umijs/max';
import { Affix, Button, ConfigProvider } from 'antd';
import GroupTypes from './GroupTypes';

export default () => {
  const { state } = useModel('Content.model');
  const { setGlobalData } = useModel('global');
  const { initialState } = useModel('@@initialState');
  const data = state.resumeData;
  const { loading, run: genMyResume } = useRequest(
    () =>
      createResume(
        {
          title: data.title,
          templateCode: data.templateCode,
          content: data.content,
        },
        { ignoreInterceptErr: true },
      ).then((res) => {
        if (res.success) {
          history.push(`/editor/${res.data}`);
        }
      }),
    { manual: true },
  );

  const onCopy = () => {
    if (initialState) {
      return genMyResume();
    }
    setGlobalData({ openLogin: true });
  };

  const editData = () => {
    history.push(`/editor/${state.resumeData.id}`);
  };
  return (
    <Affix offsetTop={75} className={'hidden lg:inline-block'}>
      <div className={'space-y-5'}>
        <GroupTypes />
        <div className={'flex flex-col space-y-2'}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: subThemeColor,
              },
            }}
          >
            <Template>
              <Button type={'primary'} icon={<Theme />} block ghost>
                <span className={'g-line-bg-text'}>切换模板</span>
              </Button>
            </Template>
            <Button type={'primary'} loading={loading} icon={<DoubleRight />} onClick={onCopy}>
              一键使用
            </Button>
            <AccessAdmin>
              <Button type={'primary'} icon={<SettingTwo />} ghost onClick={editData}>
                <span className={'g-line-bg-text'}>修改数据</span>
              </Button>
            </AccessAdmin>
          </ConfigProvider>
        </div>
      </div>
    </Affix>
  );
};
