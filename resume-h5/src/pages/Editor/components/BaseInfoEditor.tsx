import { ResumeDataContext } from '@/context';
import SvgIcons, { IconsMap } from '@/pages/components/SvgIcons';
import PopupCloseIcon from '@/pages/Editor/components/PopupCloseIcon';
import { AddItem, CloseOne, Fill } from '@icon-park/react';
import { Button, Input, Popup } from 'antd-mobile';
import { useContext, useState } from 'react';

type PropsType = {
  children: JSX.Element;
};

export default (props: PropsType) => {
  const [open, setOpen] = useState(false);
  const { resumeData, updateResume } = useContext(ResumeDataContext);

  const updateBaseInfoIcon = (name: string, index: number) => {
    resumeData.content.baseInfo.list[index].icon = name;
    updateResume(resumeData);
  };

  const onCreateBaseInfo = () => {
    resumeData.content.baseInfo.list.push({
      key: 'key',
      value: 'value',
    });
    updateResume(resumeData);
  };

  return (
    <>
      <Popup
        visible={open}
        showCloseButton
        stopPropagation={[]}
        getContainer={null}
        closeIcon={<PopupCloseIcon />}
        onMaskClick={() => setOpen(false)}
        onClose={() => setOpen(false)}
        bodyStyle={{ height: '80vh' }}
      >
        <div className={'space-y-2 p-4'}>
          <Input
            value={resumeData.title}
            className={'font-semibold text-[18px] border-b border-1 border-dashed border-zinc-600  p-1'}
            placeholder="请输入简历标题"
            onChange={(v) => {
              resumeData.content.title = v;
              resumeData.title = v;
              updateResume(resumeData);
            }}
          />
          <Input
            className={'text-[14px] border-b border-1 border-zinc-600 border-dashed p-1'}
            value={resumeData.content.config.desc}
            placeholder="请输入其他信息（选填）"
            onChange={(v) => {
              resumeData.content.config.desc = v;
              updateResume(resumeData);
            }}
          />
          <div className={'space-y-2'}>
            {resumeData.content.baseInfo.list?.map((item, index) => {
              const InfoIcon = item.icon ? IconsMap[item.icon] : Fill;
              return (
                <div
                  key={index}
                  className={
                    'flex w-full items-center justify-between border border-dashed border-1 border-zinc-600 rounded'
                  }
                >
                  <span className={'flex pl-2'}>
                    <SvgIcons readOnly={false} onSelect={(name) => updateBaseInfoIcon(name, index)}>
                      <InfoIcon className={'text-[18px]'} />
                    </SvgIcons>
                  </span>
                  <Input
                    placeholder="属性(key)"
                    value={item.key}
                    onChange={(v) => {
                      resumeData.content.baseInfo.list[index].key = v;
                      updateResume(resumeData);
                    }}
                    className={'!max-w-[100px] p-1 border-r border-r-1 border-r-zinc-200'}
                  />
                  <Input
                    placeholder="值(value)"
                    value={item.value}
                    onChange={(v) => {
                      resumeData.content.baseInfo.list[index].value = v;
                      updateResume(resumeData);
                    }}
                    className={'flex-1 py-1 px-2'}
                  />
                  <span
                    className={'p-1'}
                    onClick={() => {
                      resumeData.content.baseInfo.list.splice(index, 1);
                      updateResume(resumeData);
                    }}
                  >
                    <CloseOne theme="outline" size="20" />
                  </span>
                </div>
              );
            })}
          </div>
          <div className={'space-x-4 flex items-center pt-4'}>
            <Button block size="middle" fill={'outline'} onClick={onCreateBaseInfo}>
              <span className={'flex items-center space-x-2'}>
                <AddItem theme="filled" size="20" fill="#333" />
                <span>添加基础信息</span>
              </span>
            </Button>
            <Button block color="primary" size="middle" onClick={() => setOpen(false)}>
              <span className={'whitespace-nowrap'}>确认</span>
            </Button>
          </div>
        </div>
      </Popup>
      <div onClick={() => setOpen(true)}>{props.children}</div>
    </>
  );
};
