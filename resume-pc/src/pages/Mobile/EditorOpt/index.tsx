import { getResumeInfo, updateResume } from '@/api/Resume';
import { EditModeType } from '@/components/QuillResumeEditor';
import { getResumeTemplate } from '@/constants/template-data';
import { ResumeDataContext } from '@/context';
import { reversalColor } from '@/utils/tools';
import { useParams } from '@umijs/max';
import { useDebounceFn, useLocalStorageState, useSetState, useUpdateEffect } from 'ahooks';
import React, { useCallback, useEffect, useState } from 'react';
import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';
import BaseInfo from './components/BaseInfo';

export default () => {
  const params = useParams();
  const [editMode, setEditMode] = useLocalStorageState<EditModeType>('edit-mode', { defaultValue: 'snow' });
  const [readOnly, setReadOnly] = useState(true);
  const [resumeData, setResumeData] = useSetState<IResumeData>(getResumeTemplate());
  const [editContentTitleId, setEditContentTitleId] = useState('');

  const getResumeData = () => {
    getResumeInfo({ id: Number(params.rId) }).then((res) => {
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
    });
  }, [resumeData]);

  const { run: onUpdate } = useDebounceFn(updateData, { wait: 1500 });

  const updateResumeData = (data: IResumeData) => setResumeData({ ...data });
  const tempColor = reversalColor(resumeData.content.config.themeColor);

  useUpdateEffect(() => {
    if (params.rId) onUpdate();
  }, [resumeData]);

  useEffect(() => {
    getResumeData();
  }, []);

  // 页面关闭时
  useEffect(() => {
    return () => {
      onUpdate();
    };
  }, []);

  return (
    <ResumeDataContext.Provider
      value={{
        editMode,
        resumeData,
        readOnly,
        editContentTitleId,
        updateEditMode: setEditMode,
        updateResume: updateResumeData,
        toggleReadonly: setReadOnly,
        luma: tempColor.luma,
        contrastColor: tempColor.contrastColor,
        updateEditContentTitleId: (id) => setEditContentTitleId(id),
      }}
    >
      <div className={'min-h-screen w-full space-y-3 bg-gray-200 p-1'}>
        <BaseInfo />
      </div>
    </ResumeDataContext.Provider>
  );
};
