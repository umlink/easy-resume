import { newSSETask } from '@/api/Ai';
import { ResumeDataContext } from '@/context';
import { IContent } from '@/interface/resume';
import QuillEditor from '@/pages/components/QuillEditor';
import PopupCloseIcon from '@/pages/Editor/components/PopupCloseIcon';
import { generateRandomID } from '@/utils/tools';
import { useModel } from '@@/exports';
import { useMemoizedFn } from 'ahooks';
import { Button, Popup, Toast } from 'antd-mobile';
import { useContext, useState } from 'react';

type PropsType = {
  children: JSX.Element;
  contentInfo: IContent;
  pIndex: number;
  index: number;
  keywords: string[];
};
export default (props: PropsType) => {
  const { contentInfo, pIndex, index } = props;
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const { getMyVipInfo, sendAiSseEvent } = useModel('global');
  const [open, setOpen] = useState(false);
  const [optLoading, setOptLoading] = useState(false);
  const [description, setDescription] = useState('');

  const createAiTask = useMemoizedFn(() => {
    Toast.show({
      icon: 'loading',
      content: '智能处理中',
      duration: 0,
    });
    const contentModule = resumeData.content.entryList[pIndex].contentList[index];
    if (!contentModule.content || contentModule.content === '<p></p>') {
      return Toast.show('请尽量补充一些内容');
    }
    const keywords = props.keywords.reduce((pre, next, index) => {
      return `${pre}\n ${index + 2}. ${next}`;
    }, '');
    setOptLoading(true);
    newSSETask({
      content: `根据给出的简历内容进行错别字修改和对内容进行更加专业的优化，
      优化原则：
        1. 保留输入的格式
        ${keywords}
      请直接给出优化后的结果,无需说明信息，待优化内容如下：${contentModule.content}`,
    }).then((res) => {
      if (res.success) {
        const messages: string[] = [];
        sendAiSseEvent(`/resume-api/ai/resume/chat?taskId=${res.data}`, (event: any) => {
          if (event.data.startsWith('done-')) {
            setOptLoading(false);
            return;
          }
          if (event.data === 'done') {
            setOptLoading(false);
            getMyVipInfo();
          } else {
            messages.push(event.data);
          }
          setDescription(messages.join(''));
          setOpen(true);
          Toast.clear();
        });
      }
    });
  });

  const onConfirm = () => {
    const contentModule = resumeData.content.entryList[pIndex].contentList[index];
    resumeData.content.entryList[pIndex].contentList[index] = {
      ...contentModule,
      id: generateRandomID(),
      content: description,
    };
    updateResume(resumeData);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Popup
        closeIcon={<PopupCloseIcon />}
        visible={open}
        destroyOnClose
        showCloseButton
        onClose={onClose}
        stopPropagation={[]}
        bodyStyle={{ height: '80vh', width: '100%' }}
      >
        <div className={'p-3 space-y-2 h-[80vh] overflow-y-auto'}>
          <div className={`p-1 text-[18px] font-semibold`}>{contentInfo?.title}</div>
          <div className={'flex items-center justify-between text-[15px] text-zinc-600'}>
            <span className={'p-1]'}>{contentInfo?.subTitle}</span>
            <span className={'p-1'}>{contentInfo?.time}</span>
          </div>
          <div
            className={`h-[calc(80vh-110px)] pb-6 [&_.ql-toolbar]:bg-white bg-zinc-50 rounded p-1
            [&_.ql-toolbar]:sticky [&_.ql-toolbar]:top-0 [&_.ql-toolbar]:z-[99999]
              [&_.quill-editor]:!max-h-full [&_.quill-editor]:overflow-y-auto`}
          >
            <QuillEditor insertLoading={optLoading} html={description} readOnly={true} theme={'snow'} />
          </div>
        </div>
        <div className={'fixed inset-x-0 bottom-0 px-4 pb-5 flex space-x-4'}>
          <Button block color={'primary'} shape={'rounded'} fill={'outline'} size={'middle'} onClick={onClose}>
            丢弃
          </Button>
          <Button block shape={'rounded'} color={'primary'} size={'middle'} onClick={onConfirm}>
            采纳优化结果
          </Button>
        </div>
      </Popup>
      <div onClick={createAiTask}>{props.children}</div>
    </>
  );
};
