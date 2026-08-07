import { ResumeDataContext } from '@/context';
import { Select, SelectProps } from 'antd';
import { useContext } from 'react';

const options: SelectProps['options'] = [
  { label: '0px', value: 'space-y-[1px]' },
  { label: '2px', value: 'space-y-[2px]' },
  { label: '4px', value: 'space-y-1' },
  { label: '6px', value: 'space-y-[6px]' },
  { label: '8px', value: 'space-y-2' },
  { label: '10px', value: 'space-y-[10px]' },
  { label: '12px', value: 'space-y-3' },
];
export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const onHandler = (value: string) => {
    resumeData.content.config.lineSpace = value;
    updateResume(resumeData);
  };
  return (
    <div className={'py-3'}>
      <div className={'flex items-center justify-between'}>
        <span className={'g-line-before-title'}>模块间距</span>
        <Select
          size={'small'}
          style={{ width: 106 }}
          value={resumeData.content.config.lineSpace}
          placeholder="模块间距"
          variant="filled"
          options={options}
          onChange={onHandler}
        />
      </div>
    </div>
  );
};
