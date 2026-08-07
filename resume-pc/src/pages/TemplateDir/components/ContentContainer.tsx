import { newSSETask } from '@/api/Ai';
import { ResumeDataContext } from '@/context';
import QuillResumeEditor from '@/components/QuillResumeEditor';
import { IEntryItem } from '@/pages/EditorOpt/ResumeInterface';
import { generateRandomID } from '@/utils/tools';
import { Delete, DownTwo, PlusCross, UpTwo, SettingTwo, Aiming } from '@icon-park/react';
import { useHover } from 'ahooks';
import { Button, Drawer, message, Modal, Tooltip } from 'antd';
import { ButtonShape } from 'antd/es/button';
import { arrayMoveImmutable } from 'array-move';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useModel } from '@umijs/max';
import AiOptBtn from './AiOptBtn';

type PropsType = {
  children: JSX.Element;
  pIndex: number;
  sIndex: number;
  parent: IEntryItem;
};

type actionType = {
  icon: JSX.Element;
  handler: any;
  shape?: ButtonShape;
  show: boolean;
  title?: string;
  text?: string;
};

export default (props: PropsType) => {
  const [modal, contextHolder] = Modal.useModal();
  const { sendAiSseEvent, getMyVipInfo } = useModel('global');
  const [showOpt, setShowOpt] = useState(false);
  const [description, setDescription] = useState('');
  const [optStr, setOptStr] = useState('');
  const { pIndex, sIndex, parent } = props;
  const { readOnly, resumeData, updateResume, updateEditContentTitleId } = useContext(ResumeDataContext);
  const [isHover, setIsHover] = useState(false);
  const [optLoading, setOpLoading] = useState<boolean>(false);
  const ref = useRef(null);

  const customText = '自定义';

  const onCreateContent = () => {
    resumeData.content.entryList[pIndex].contentList.splice(sIndex + 1, 0, {
      id: generateRandomID(),
      title: '自定义标题',
      subTitle: customText,
      time: customText,
      content: customText,
    });
    updateResume(resumeData);
  };

  const createAiTask = useCallback(
    (keywords?: string) => {
      if (keywords) {
        setOptStr(keywords);
      }
      if (optLoading) return;
      setOpLoading(true);
      const contentModule = resumeData.content.entryList[pIndex].contentList[sIndex];
      if (!contentModule.content || contentModule.content === '<p></p>') {
        return message.warning('请尽量补充一些内容');
      }
      const content = description || contentModule.content;
      newSSETask({
        content: `根据给出的简历内容进行错别字修改和对内容进行更加专业的优化，
      优化原则：
        1. 保留输入的格式
        ${keywords || optStr}
      请直接给出优化后的结果,无需说明信息，待优化内容如下：${content}`,
      }).then((res) => {
        if (res.success) {
          const messages: string[] = [];
          sendAiSseEvent(`/resume-api/ai/resume/chat?taskId=${res.data}`, (event: any) => {
            if (event.data.startsWith('done-')) {
              message.warning(event.data.replace('done-', ''));
              setOpLoading(false);
              return;
            }
            if (event.data === 'done') {
              setOpLoading(false);
              getMyVipInfo();
            } else {
              messages.push(event.data);
            }
            setShowOpt(true);
            setDescription(messages.join(''));
          });
        }
      });
    },
    [description, resumeData],
  );

  const onCancelOpt = () => {
    setDescription('');
    setShowOpt(false);
  };

  const onMove = (action: number) => {
    const newEntryList = [...resumeData.content.entryList];
    const newContentList = arrayMoveImmutable(newEntryList[pIndex].contentList, sIndex, sIndex + action);
    const movedIndex = sIndex + action;
    newContentList[movedIndex] = {
      ...newContentList[movedIndex],
      id: generateRandomID(),
    };
    newEntryList[pIndex] = {
      ...newEntryList[pIndex],
      contentList: newContentList,
    };
    updateResume({
      ...resumeData,
      content: {
        ...resumeData.content,
        entryList: newEntryList,
      },
    });
  };

  const onReplaceContent = useCallback(() => {
    const contentModule = resumeData.content.entryList[pIndex].contentList[sIndex];
    resumeData.content.entryList[pIndex].contentList[sIndex] = {
      ...contentModule,
      id: generateRandomID(),
      content: description,
    };
    updateResume(resumeData);
  }, [description]);

  const delContent = () => {
    modal.confirm({
      title: '温馨提示',
      content: '确认删除当前内容模块？',
      onOk: () => {
        resumeData.content.entryList[pIndex].contentList.splice(sIndex, 1);
        updateResume(resumeData);
      },
      okType: 'danger',
    });
  };

  const magicStyle = { color: '#c026d3', display: 'flex' };

  const actions: actionType[] = [
    {
      icon: <UpTwo />,
      handler: () => onMove(-1),
      show: sIndex > 0,
      title: '上移',
    },
    {
      icon: <DownTwo />,
      handler: () => onMove(1),
      show: !(parent.contentList.length - 1 === sIndex),
      title: '下移',
    },
    {
      icon: <PlusCross />,
      handler: onCreateContent,
      show: true,
      title: '添加',
    },
    {
      icon: <Delete />,
      handler: delContent,
      show: parent.contentList.length > 1,
      title: '删除',
    },
    {
      icon: <SettingTwo />,
      handler: () => updateEditContentTitleId?.(parent.contentList[sIndex].id),
      show: true,
      title: '标题样式',
    },
  ];

  useHover(ref, {
    onLeave: () => setIsHover(false),
    onEnter: () => setIsHover(true),
  });

  useEffect(() => {
    setIsHover(false);
  }, [sIndex]);

  return (
    <div
      className={`group/content relative rounded-sm
      ${isHover ? 'bg-zinc-50 !outline !outline-[2px] outline-zinc-700' : ''}`}
    >
      {props.children}
      <Drawer
        width={'90%'}
        styles={{ body: { padding: 4 } }}
        placement="right"
        closable={false}
        open={showOpt}
        onClose={() => setShowOpt(false)}
        getContainer={false}
      >
        <QuillResumeEditor
          insertLoading={optLoading}
          placeholder={'请输入该模块的一些简要介绍和关键信息，尽量多的阐述内容描述，AI 将帮您美化内容'}
          className={'h-[calc(100%-32px)] max-h-[calc(100%-32px)] overflow-y-scroll'}
          html={description}
          readOnly={true}
          theme={'snow'}
          onChange={setDescription}
        />
        <div className={'flex items-center justify-end space-x-2 py-1'}>
          <Button
            size={'small'}
            loading={optLoading}
            onClick={() => createAiTask()}
            icon={<Aiming size={16} style={magicStyle} />}
          >
            <span style={magicStyle}>{optLoading ? '正在优化' : '重新优化'}</span>
          </Button>
          <Button disabled={optLoading} size={'small'} type={'dashed'} onClick={onCancelOpt}>
            取消
          </Button>
          <Button disabled={optLoading} size={'small'} onClick={onReplaceContent}>
            一键采纳
          </Button>
        </div>
      </Drawer>
      {!readOnly && (
        <div className={'absolute bottom-1 left-0 right-0 flex items-end justify-between px-1'}>
          <AiOptBtn optLoading={optLoading} pIndex={pIndex} sIndex={sIndex} createAiTask={createAiTask} />
          <div className={`hidden group-hover/content:block`} ref={ref}>
            <div className={'space-x-2 rounded'}>
              {actions
                .filter((d) => d.show)
                .map((item, index) => {
                  return (
                    <Tooltip key={index} title={item.title}>
                      <Button
                        shape={item.shape ?? 'circle'}
                        loading={!!item.text && optLoading}
                        className={'shadow-md'}
                        size={'small'}
                        icon={<span className={'text-[16px] text-zinc-700'}>{item.icon}</span>}
                        onClick={item.handler}
                      >
                        {item.text ? <span style={magicStyle}>{item.text}</span> : ''}
                      </Button>
                    </Tooltip>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      {contextHolder}
    </div>
  );
};
