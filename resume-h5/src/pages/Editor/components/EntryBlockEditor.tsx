import { ResumeDataContext } from '@/context';
import { IContent } from '@/interface/resume';
import QuillEditor from '@/pages/components/QuillEditor';
import PopupCloseIcon from '@/pages/Editor/components/PopupCloseIcon';
import { Input, Popup } from 'antd-mobile';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';

type PropsType = {
  children: JSX.Element;
  contentInfo: IContent;
  pIndex: number;
  index: number;
};
export default (props: PropsType) => {
  const { contentInfo, pIndex, index } = props;
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const [open, setOpen] = useState(false);
  const borderBottom = `border-b border-dashed border-1 border-zinc-300`;

  const onClose = () => {
    resumeData.updatedAt = dayjs().format('YYYY-MM-DD hh:mm:ss');
    updateResume(resumeData);
    setOpen(false);
  };

  return (
    <>
      <Popup
        closeIcon={<PopupCloseIcon />}
        visible={open}
        showCloseButton
        onClose={onClose}
        bodyStyle={{ height: '100vh' }}
      >
        <div className={'p-3 space-y-2 overflow-y-auto border-t border-t-zinc-100'}>
          <Input
            className={`p-1 text-[18px] font-semibold ${borderBottom}`}
            placeholder="请输入标题"
            value={contentInfo?.title}
            onChange={(title) => {
              resumeData.content.entryList[pIndex].contentList[index].title = title;
              updateResume(resumeData);
            }}
          />
          <div className={'flex items-center'}>
            <Input
              className={`p-1 text-[18px] border-r ${borderBottom}`}
              placeholder="请输入标题2"
              value={contentInfo?.subTitle}
              onChange={(subTitle) => {
                resumeData.content.entryList[pIndex].contentList[index].subTitle = subTitle;
                updateResume(resumeData);
              }}
            />
            <Input
              label="标题3"
              className={`p-1 text-[18px] [&_.adm-input-element]:text-right ${borderBottom}`}
              placeholder="请输入标题3"
              value={contentInfo?.time}
              onChange={(time) => {
                resumeData.content.entryList[pIndex].contentList[index].time = time;
                updateResume(resumeData);
              }}
            />
          </div>
          <div
            className={`h-[calc(100vh-110px)] [&_.ql-toolbar]:bg-white
            [&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-[99999]
              [&_.quill-editor]:!max-h-full [&_.quill-editor]:overflow-y-auto`}
          >
            <QuillEditor
              theme={'snow'}
              html={contentInfo?.content}
              onChange={(v) => {
                resumeData.content.entryList[pIndex].contentList[index].content = v;
                updateResume(resumeData);
              }}
            />
          </div>
        </div>
      </Popup>
      <div onClick={() => setOpen(true)}>{props.children}</div>
    </>
  );
};
