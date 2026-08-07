import { ResumeDataContext } from '@/context';
import { generateRandomID } from '@/utils/tools';
import { Delete, DownTwo, PlusCross, UpTwo } from '@icon-park/react';
import { useHover } from 'ahooks';
import { Button, Modal } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import { useContext, useEffect, useRef, useState } from 'react';

type PropsType = {
  children: JSX.Element;
  index: number;
  item: any;
  className?: string;
};

export default (props: PropsType) => {
  const [modal, contextHolder] = Modal.useModal();
  const [isHover, setIsHover] = useState(false);
  const ref = useRef(null);
  const { readOnly, resumeData, updateResume } = useContext(ResumeDataContext);

  const customText = '自定义';
  const onCreateEntry = () => {
    resumeData.content.entryList.splice(props.index + 1, 0, {
      id: generateRandomID(),
      title: customText,
      contentList: [
        {
          id: generateRandomID(),
          title: customText,
          subTitle: customText,
          time: customText,
          content: customText,
        },
      ],
    });
    updateResume(resumeData);
  };

  const onMove = (action: number) => {
    const newEntryList = arrayMoveImmutable(resumeData.content.entryList, props.index, props.index + action);
    const movedIndex = props.index + action;
    newEntryList[movedIndex] = {
      ...newEntryList[movedIndex],
      id: generateRandomID(),
    };
    updateResume({
      ...resumeData,
      content: {
        ...resumeData.content,
        entryList: newEntryList,
      },
    });
  };

  const onDelete = () => {
    resumeData.content.entryList.splice(props.index, 1);
    resumeData.content.entryList = [...resumeData.content.entryList];
    updateResume(resumeData);
  };

  const deleteConfirm = () => {
    modal.confirm({
      title: '温馨提示',
      content: (
        <p>
          确认删除当前模块<b>【{props.item.title}】</b>？
        </p>
      ),
      onOk: onDelete,
      okType: 'danger',
    });
  };

  const actions = [
    {
      icon: <UpTwo title={'上移'} />,
      handler: () => onMove(-1),
      show: props.index > 0,
    },
    {
      icon: <PlusCross title={'添加'} />,
      handler: onCreateEntry,
      show: true,
    },
    {
      icon: <Delete title={'删除'} />,
      handler: deleteConfirm,
      show: resumeData.content.entryList.length > 1,
    },
    {
      icon: <DownTwo title={'下移'} />,
      handler: () => onMove(1),
      show: !(resumeData.content.entryList.length - 1 === props.index),
    },
  ];

  useHover(ref, {
    onLeave: () => setIsHover(false),
    onEnter: () => setIsHover(true),
  });

  useEffect(() => {
    setIsHover(false);
  }, [props.index]);

  return (
    <div
      className={`group/block relative rounded-sm
      ${!readOnly ? 'hover:outline hover:outline-1 hover:outline-zinc-900' : ''}
      ${props.className}
      ${isHover ? 'outline !outline-[2px]' : ''}`}
    >
      {props.children}
      {!readOnly && (
        <div
          className={`absolute bottom-0
            right-[-32px] top-[-2px] z-10 hidden px-1
            group-hover/block:block`}
        >
          <div className={'flex flex-col space-y-2'} ref={ref}>
            {actions
              .filter((d) => d.show)
              .map((item, index) => {
                return (
                  <Button
                    className={'shadow'}
                    shape={'circle'}
                    size={'small'}
                    icon={<span className={'text-[16px] text-zinc-600'}>{item.icon}</span>}
                    onClick={item.handler}
                    key={index}
                  />
                );
              })}
          </div>
        </div>
      )}
      {contextHolder}
    </div>
  );
};
