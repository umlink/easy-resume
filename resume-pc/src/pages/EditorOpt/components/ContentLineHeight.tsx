import { ResumeDataContext } from '@/context';
import { Select, SelectProps } from 'antd';
import { useContext } from 'react';

const options: SelectProps['options'] = [
  { label: '16px', value: '[&_.ql-editor]:!leading-[16px]' },
  { label: '18px', value: '[&_.ql-editor]:!leading-[18px]' },
  { label: '20px', value: '[&_.ql-editor]:!leading-[20px]' },
  { label: '22px', value: '[&_.ql-editor]:!leading-[22px]' },
  { label: '24px', value: '[&_.ql-editor]:!leading-[24px]' },
  { label: '26px', value: '[&_.ql-editor]:!leading-[26px]' },
  { label: '28px', value: '[&_.ql-editor]:!leading-[28px]' },
  { label: '30px', value: '[&_.ql-editor]:!leading-[30px]' },
];
export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const onHandler = (value: string) => {
    resumeData.content.config.lineHeight = value;
    updateResume(resumeData);
  };
  return (
    <div className={'py-3'}>
      <div className={'flex items-center justify-between'}>
        <span className={'g-line-before-title'}>内容行高</span>
        <Select
          size={'small'}
          style={{ width: 106 }}
          value={resumeData.content.config.lineHeight ?? '[&_.ql-editor]:!leading-[24px]'}
          placeholder="内容行高"
          variant="filled"
          options={options}
          onChange={onHandler}
        />
      </div>
    </div>
  );
};
