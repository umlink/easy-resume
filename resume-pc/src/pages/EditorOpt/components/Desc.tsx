import { ResumeDataContext } from '@/context';
import { Switch, Tooltip } from 'antd';
import { useContext } from 'react';

export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const onChange = (value: boolean) => {
    resumeData.content.config.showDesc = value;
    updateResume(resumeData);
  };
  return (
    <div className={'py-3'}>
      <div className={'flex items-center justify-between'}>
        <span className={'g-line-before-title'}>求职意向</span>
        <Tooltip title={resumeData.content.config.showDesc ? '隐藏' : '显示'} placement={'top'}>
          <Switch size={'small'} onChange={onChange} checked={resumeData.content.config.showDesc} />
        </Tooltip>
      </div>
    </div>
  );
};
