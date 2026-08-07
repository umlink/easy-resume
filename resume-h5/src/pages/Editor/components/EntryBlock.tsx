import { ResumeDataContext } from '@/context';
import { IEntryItem } from '@/interface/resume';
import QuillEditor from '@/pages/components/QuillEditor';
import TitleIcons from '@/pages/components/TitleIcons';
import AiOptContent from '@/pages/Editor/components/AiOptContent';
import DelContent from '@/pages/Editor/components/DelContent';
import EntryBlockEditor from '@/pages/Editor/components/EntryBlockEditor';
import PopupCloseIcon from '@/pages/Editor/components/PopupCloseIcon';
import { generateRandomID } from '@/utils/tools';
import { AddItem, Delete, Down, Up } from '@icon-park/react';
import { Button, Dialog, Input, Popup } from 'antd-mobile';
import { arrayMoveImmutable } from 'array-move';
import { useContext, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

type PropsType = {
  children: JSX.Element;
  blockInfo: IEntryItem;
  pIndex: number;
};

export default (props: PropsType) => {
  const { pIndex, blockInfo } = props;
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const [open, setOpen] = useState(false);
  const [expand, setExpand] = useState(true);
  const [blockList, setBlockList] = useState(['1', '2', '3', '4', '5']);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    resumeData.content.entryList[pIndex].contentList = arrayMoveImmutable(
      props.blockInfo.contentList,
      result.source.index,
      result.destination.index,
    );
    updateResume(resumeData);
  };

  const onDelete = () => {
    Dialog.confirm({
      title: '警告',
      content: '是否删除当前整个模块？',
      onConfirm: async () => {
        resumeData.content.entryList.splice(pIndex, 1);
        resumeData.content.entryList = [...resumeData.content.entryList];
        updateResume(resumeData);
      },
    });
  };

  const customText = '自定义';
  const onCreateContent = () => {
    resumeData.content.entryList[props.pIndex].contentList.splice(blockInfo.contentList.length + 1, 0, {
      id: generateRandomID(),
      title: '自定义标题',
      subTitle: customText,
      time: customText,
      content: customText,
    });
    updateResume(resumeData);
  };

  const onSelectIcon = (icon: string) => {
    resumeData.content.entryList[pIndex].icon = icon;
    updateResume(resumeData);
  };

  return (
    <>
      <Popup
        visible={open}
        showCloseButton
        stopPropagation={[]}
        closeIcon={<PopupCloseIcon />}
        onMaskClick={() => setOpen(false)}
        onClose={() => setOpen(false)}
        position="bottom"
        bodyStyle={{ height: '100vh', width: '100%', fontSize: 14 }}
      >
        <div className={'relative border-t border-t-zinc-100'}>
          <div className={'px-3 py-2 flex items-center space-x-2 border-b border-b-1 border-zinc-200'}>
            <TitleIcons readOnly={false} onSelect={onSelectIcon} type={blockInfo.icon} />
            <div className={'border border-dashed border-zinc-300 px-2 rounded'}>
              <Input
                value={blockInfo.title}
                className={'w-[150px] font-semibold text-[14px]'}
                placeholder="请输入模块标题"
                onChange={(title) => {
                  resumeData.content.entryList[pIndex].title = title;
                  updateResume(resumeData);
                }}
              />
            </div>
          </div>
          <div className={'text-orange-500 px-2 py-1 text-[12px]'}>可拖拽调整模块位置(一键收起后操作更佳)</div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <div
                  ref={droppableProvided.innerRef}
                  className={'px-2 h-[calc(100vh-76px)] overflow-y-scroll pb-[80px]'}
                >
                  {blockInfo.contentList.map((item, index) => {
                    return (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            key={item.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1,
                            }}
                            className={'mt-2 first:mt-0'}
                          >
                            <EntryBlockEditor contentInfo={item} pIndex={pIndex} index={index}>
                              <div
                                className={'border border-dashed border-1 pb-2 border-zinc-300 p-1 rounded bg-white'}
                              >
                                <div className={'mb-2 space-y-2'}>
                                  <div className={'flex-center-between text-[16px]'}>
                                    <b>{item.title}</b>
                                    <div className={'flex space-x-2'}>
                                      <AiOptContent contentInfo={item} pIndex={pIndex} index={index} />
                                      <DelContent pIndex={pIndex} index={index}>
                                        <div className={'flex-center-between space-x-2'}>
                                          <span className={'flex p-1 bg-red-50 rounded'}>
                                            <Delete theme="outline" size="18" fill="#f74946" />
                                          </span>
                                        </div>
                                      </DelContent>
                                    </div>
                                  </div>
                                  <div className={'flex-center-between text-zinc-600'}>
                                    <span>{item.subTitle}</span>
                                    <span>{item.time}</span>
                                  </div>
                                </div>
                                {expand && (
                                  <QuillEditor key={resumeData.updatedAt + item.id} readOnly html={item.content} />
                                )}
                              </div>
                            </EntryBlockEditor>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div
            className={'absolute bottom-0 py-4 left-0 right-0 flex items-center justify-center space-x-4 bg-white/80'}
          >
            <Button className={'bg-red-50'} shape="rounded" size={'mini'} fill="outline" onClick={onDelete}>
              <span className={'flex items-center space-x-1'}>
                <Delete theme="outline" size="18" fill="#f74946" />
                <span className={'text-[14px]'} style={{ color: '#f74946' }}>
                  删除模块
                </span>
              </span>
            </Button>
            <Button shape="rounded" color="primary" size={'mini'} onClick={() => setExpand(!expand)}>
              <span className={'text-[14px] flex items-center'}>
                {expand ? <Up /> : <Down />}
                <span>一键{expand ? '收起' : '展开'}</span>
              </span>
            </Button>
            <Button shape="rounded" color="primary" size={'mini'} onClick={onCreateContent}>
              <span className={'text-[14px] flex items-center space-x-1'}>
                <AddItem theme="outline" />
                <span>添加子模块</span>
              </span>
            </Button>
          </div>
        </div>
      </Popup>
      <span onClick={() => setOpen(true)}>{props.children}</span>
    </>
  );
};
