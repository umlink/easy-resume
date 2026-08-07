import { ResumeDataContext } from '@/context';
import { Segmented } from 'antd';
import React, { useContext } from 'react';
import CopyData from './CopyData';
import Export from './Export';
import AiOpt from './AiOpt';

export default () => {
  const { readOnly, toggleReadonly } = useContext(ResumeDataContext);
  return (
    <div className={'sticky top-0 z-10 flex items-center justify-between bg-white py-3 pt-4'}>
      <Segmented
        value={readOnly}
        options={[
          { label: '编辑', value: false },
          { label: '预览', value: true },
        ]}
        onChange={(value) => toggleReadonly?.(value)}
      />
      <span className={'flex items-center space-x-2'}>
        <CopyData />
        <Export />
        <AiOpt />
      </span>
    </div>
  );
};
