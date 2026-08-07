import { ResumeDataContext } from '@/context';
import { InputNumber } from 'antd';
import React, { useContext } from 'react';

export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);

  const changeMargin = (val: any, type: string) => {
    resumeData.content.margin = {
      ...resumeData.content.margin,
      [type]: val || 0,
    };
    updateResume(resumeData);
  };

  return (
    <div className={'py-3'}>
      <div className={'mb-3 flex items-center justify-between'}>
        <span className={'g-line-before-title'}>边距调整</span>
      </div>
      <div className={'grid grid-cols-2 gap-2 [&_.ant-input-number-input]:!pl-5'}>
        <InputNumber
          size={'small'}
          variant="filled"
          style={{ width: '100%' }}
          defaultValue={resumeData.content.margin.top}
          onChange={(e) => changeMargin(e, 'top')}
          prefix={'上'}
        />
        <InputNumber
          size={'small'}
          variant="filled"
          style={{ width: '100%' }}
          defaultValue={resumeData.content.margin.bottom}
          onChange={(e) => changeMargin(e, 'bottom')}
          prefix={'下'}
        />
        <InputNumber
          size={'small'}
          variant="filled"
          className={'[&_.ant-input-number-input]:!pl-4'}
          style={{ width: '100%' }}
          defaultValue={resumeData.content.margin.left}
          onChange={(e) => changeMargin(e, 'left')}
          prefix={'左'}
        />
        <InputNumber
          size={'small'}
          variant="filled"
          style={{ width: '100%' }}
          defaultValue={resumeData.content.margin.right}
          onChange={(e) => changeMargin(e, 'right')}
          prefix={'右'}
        />
      </div>
    </div>
  );
};
