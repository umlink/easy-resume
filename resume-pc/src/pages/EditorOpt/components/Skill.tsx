import { ResumeDataContext } from '@/context';
import { Switch, Tooltip, InputNumber, Select, SelectProps } from 'antd';
import { useContext } from 'react';

const options: SelectProps['options'] = [
  { label: '进度圈', value: 'dashboard' },
  { label: '进度条', value: 'step' },
];

export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const onChange = (show: boolean) => {
    resumeData.content.skill.show = show;
    updateResume(resumeData);
  };
  return (
    <div className={'space-y-3 py-3'}>
      <div className={'flex items-center justify-between'}>
        <span className={'g-line-before-title'}>技能特长</span>
        <Tooltip title={resumeData.content.skill.show ? '隐藏' : '显示'} placement={'top'}>
          <Switch size={'small'} onChange={onChange} checked={resumeData.content.skill.show} />
        </Tooltip>
      </div>
      {resumeData.content.skill.show && (
        <>
          <div className={'flex items-center justify-between'}>
            <span>标题换行</span>
            <Switch
              size={'small'}
              onChange={(v: boolean) => {
                resumeData.content.skill.titleWarp = v;
                updateResume(resumeData);
              }}
              checked={resumeData.content.skill.titleWarp ?? true}
            />
          </div>
          <div className={'flex items-center justify-between'}>
            <span>排列方式</span>
            <Select
              size={'small'}
              style={{ width: 100 }}
              value={resumeData.content.skill.direction || 'col'}
              placeholder="Filled"
              variant="filled"
              options={[
                { label: '横向', value: 'row' },
                { label: '竖向', value: 'col' },
              ]}
              onChange={(direction: 'row' | 'col') => {
                resumeData.content.skill.direction = direction;
                updateResume(resumeData);
              }}
            />
          </div>
          <div className={'flex items-center justify-between'}>
            <span>显示方式</span>
            <Select
              size={'small'}
              style={{ width: 100 }}
              value={resumeData.content.skill.type || 'step'}
              placeholder="Filled"
              variant="filled"
              options={options}
              onChange={(type: string) => {
                resumeData.content.skill.type = type;
                resumeData.content.skill.size = type === 'dashboard' ? 80 : 15;
                updateResume(resumeData);
              }}
            />
          </div>
          <div className={'flex items-center justify-between'}>
            <span>尺寸大小</span>
            <InputNumber
              size={'small'}
              min={4}
              style={{ width: 100, textAlign: 'center' }}
              variant="filled"
              onChange={(v) => {
                resumeData.content.skill.size = Number(v);
                updateResume(resumeData);
              }}
              value={resumeData.content.skill.size || 15}
            />
          </div>
          <div className={'flex items-center justify-between'}>
            <span>标题宽度</span>
            <InputNumber
              size={'small'}
              min={80}
              style={{ width: 100, textAlign: 'center' }}
              variant="filled"
              onChange={(v) => {
                resumeData.content.skill.titleWidth = Number(v);
                updateResume(resumeData);
              }}
              value={resumeData.content.skill.titleWidth || 80}
            />
          </div>
        </>
      )}
    </div>
  );
};
