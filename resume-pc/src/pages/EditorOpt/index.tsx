import { getResumeInfo, updateResume } from '@/api/Resume';
import FloatTools from '@/components/FloatTools';
import { getResumeTemplate } from '@/constants/template-data';
import { ResumeDataContext } from '@/context';
import TemplateDir from '@/pages/TemplateDir';
import { reversalColor } from '@/utils/tools';
import { useParams } from '@umijs/max';
import { useDebounceFn, useSetState, useUpdateEffect } from 'ahooks';
import { Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import Actions from './Actions';
import Header from './Header';
import { IResumeData } from './ResumeInterface';

export default () => {
  const params = useParams();
  const [readOnly, setReadOnly] = useState(false);
  const [resumeData, setResumeData] = useSetState<IResumeData>(getResumeTemplate());
  const [loading, setLoading] = useState(false);
  const [editContentTitleId, setEditContentTitleId] = useState('');

  const getResumeData = () => {
    getResumeInfo({ id: Number(params.rId) }).then((res) => {
      if (res.success) {
        const data = { ...(res.data as any) } as IResumeData;
        setResumeData(data);
      }
      setLoading(false);
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

  const ResumeTemplate = TemplateDir[resumeData.templateCode];
  // const ResumeTemplate = TemplateDir['No240914'];

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
        editMode: 'snow',
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
      <Header />
      <div className={'g-block-bg flex w-full justify-center space-x-4 bg-gray-50'}>
        <Spin spinning={loading}>
          <div className={'mb-12 mt-4 w-[800px] max-w-[800px] rounded-xl bg-white shadow-md hover:shadow-xl'}>
            {!!resumeData.templateCode && <ResumeTemplate />}
          </div>
        </Spin>
        <Actions />
      </div>
      <FloatTools />
    </ResumeDataContext.Provider>
  );
};
