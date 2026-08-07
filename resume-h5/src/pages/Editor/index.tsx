import { getResumeInfo, updateResume } from '@/api/Resume';
import { getResumeTemplate } from '@/constants/template-data';
import { ResumeDataContext } from '@/context';
import { IResumeData } from '@/interface/resume';
import TitleIcons from '@/pages/components/TitleIcons';
import ActionBar from '@/pages/Editor/components/ActionBar';
import BaseInfo from '@/pages/Editor/components/BaseInfo';
import EntryBlock from '@/pages/Editor/components/EntryBlock';
import EntryBlockEditor from '@/pages/Editor/components/EntryBlockEditor';
import EntryItemInfo from '@/pages/Editor/components/EntryItemInfo';
import SkillBlock, { uniSkillKey } from '@/pages/Editor/components/SkillBlock';
import useQueryParams from '@/pages/hooks/useQueryParams';
import { generateRandomID, reversalColor } from '@/utils/tools';
import { AddItem, CollapseTextInput, Down, ExpandTextInput, SettingTwo, Up } from '@icon-park/react';
import { useDebounceFn, useSetState, useUpdateEffect } from 'ahooks';
import { Button, List } from 'antd-mobile';
import { arrayMoveImmutable } from 'array-move';
import { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import './style.less';

export default () => {
  const [expand, setExpand] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [resumeData, setResumeData] = useSetState<IResumeData>(getResumeTemplate());
  const [editContentTitleId, setEditContentTitleId] = useState('');
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [immediately, setImmediately] = useState(false);
  const [updatedKey, setUpdatedKey] = useState(0);

  const [query] = useQueryParams();

  const getResumeData = () => {
    getResumeInfo({ id: query.resumeId }).then((res) => {
      if (res.success) {
        const data = { ...(res.data as any) } as IResumeData;
        setResumeData(data);
      }
    });
  };

  const updateData = useCallback(() => {
    if (!resumeData.id) return Promise.resolve();
    return updateResume({
      id: +resumeData.id,
      title: resumeData.title,
      templateCode: resumeData.templateCode,
      dataTmp: resumeData.dataTmp,
      content: resumeData.content,
    }).then(() => {
      setUpdatedKey(updatedKey + 1);
    });
  }, [resumeData]);

  const { run: onUpdate } = useDebounceFn(updateData, { wait: 1500 });

  const updateResumeData = (data: IResumeData, immediately = false) => {
    setImmediately(immediately);
    setResumeData({ ...data });
  };
  const tempColor = reversalColor(resumeData.content.config.themeColor);

  const onExpand = () => {
    setExpand(!expand);
    if (expand) {
      setOpenKeys([]);
    } else {
      const defaultOpenKeys = resumeData.content.entryList.map((item) => item.id);
      defaultOpenKeys.push(uniSkillKey);
      setOpenKeys(defaultOpenKeys);
    }
  };

  const customText = '自定义';
  const onCreateEntry = () => {
    setOpenKeys([]);
    resumeData.content.entryList.splice(resumeData.content.entryList.length, 0, {
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
    updateResumeData(resumeData);
  };

  const onSingleExpand = (id: string) => {
    const index = openKeys.findIndex((k) => k === id);
    if (index >= 0) {
      openKeys.splice(index, 1);
    } else {
      openKeys.push(id);
    }
    setOpenKeys([...openKeys]);
  };

  useUpdateEffect(() => {
    if (immediately) {
      updateData();
    } else {
      onUpdate();
    }
  }, [resumeData]);

  useEffect(() => {
    getResumeData();
  }, []);

  useEffect(() => {
    onUpdate();
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    resumeData.content.entryList = arrayMoveImmutable(
      resumeData.content.entryList,
      result.source.index,
      result.destination.index,
    );
    updateResumeData(resumeData);
  };

  return (
    <ResumeDataContext.Provider
      value={{
        editMode: 'snow',
        updatedKey,
        resumeData,
        readOnly,
        editContentTitleId,
        updateResume: updateResumeData,
        toggleReadonly: setReadOnly,
        luma: tempColor.luma,
        contrastColor: tempColor.contrastColor,
        updateEditContentTitleId: (id) => setEditContentTitleId(id),
      }}
    >
      <div className={'pb-[100px]'}>
        <span
          className={
            'fixed z-40 right-0 top-0 px-2 text-[12px] py-1 g-line-bg-text border border-zinc-100 rounded-bl-xl'
          }
        >
          模板编号：{resumeData.templateCode}
        </span>
        <BaseInfo />
        <List
          header={
            <div className={'sticky top-0 text-[12px] flex-center-between mx-[-4px]'}>
              <span className={'flex items-center space-x-2'}>
                <span className={'g-line-bg-text'}>长按拖拽调模块整位置</span>
              </span>
              <div className={'flex items-center space-x-2'}>
                <span
                  onClick={onExpand}
                  className={'flex items-center space-x-1 px-2 py-1 rounded text-zinc-900 bg-zinc-100 text-[12px]'}
                >
                  {expand ? <Up /> : <Down />}
                  <span>全部{expand ? '收起' : '展开'}</span>
                </span>
                <Button size="mini" color="primary" onClick={onCreateEntry}>
                  <span className={'flex items-center space-x-1 text-[12px]'}>
                    <AddItem theme="filled" />
                    <span>添加模块</span>
                  </span>
                </Button>
              </div>
            </div>
          }
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <div ref={droppableProvided.innerRef}>
                  {resumeData.content.entryList.map((item, pIndex: number) => (
                    <Draggable key={item.id} draggableId={item.id} index={pIndex}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                          }}
                        >
                          <List.Item
                            className={'!pl-0 [&_.adm-list-item-content-main]:!pl-3'}
                            key={item.id}
                            extra={
                              <div className={'flex items-center space-x-2'}>
                                <span className={'flex p-1'} onClick={() => onSingleExpand(item.id)}>
                                  {openKeys.includes(item.id) ? (
                                    <CollapseTextInput theme="outline" size={18} fill="#999" />
                                  ) : (
                                    <ExpandTextInput theme="outline" size={18} fill="#999" />
                                  )}
                                </span>

                                <EntryBlock blockInfo={item} pIndex={pIndex}>
                                  <span className={'flex p-1'}>
                                    <SettingTwo theme="outline" size={20} fill={resumeData.content.config.themeColor} />
                                  </span>
                                </EntryBlock>
                              </div>
                            }
                          >
                            <div
                              style={{ color: resumeData.content.config.themeColor }}
                              className={'flex items-center space-x-2 text-zinc-700'}
                            >
                              <TitleIcons readOnly={true} type={item.icon} />
                              <b className={'text-[17px]'}>{item.title}</b>
                            </div>
                          </List.Item>
                          {openKeys.includes(item.id) && (
                            <div className={'space-y-2 text-[14px] p-2'}>
                              {item.contentList.map((item, index) => (
                                <EntryBlockEditor key={item.id} contentInfo={item} pIndex={pIndex} index={index}>
                                  <EntryItemInfo entryInfo={item} pIndex={pIndex} index={index} />
                                </EntryBlockEditor>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {resumeData?.content.skill.show && <SkillBlock onSingleExpand={onSingleExpand} openKeys={openKeys} />}
        </List>
        <EntryBlockEditor />
        <ActionBar />
      </div>
    </ResumeDataContext.Provider>
  );
};
