import DivInput from '@/components/DivInput';
import { ResumeDataContext } from '@/context';
import DelGroup from '@/pages/TemplateDir/components/DelGroup';
import PlusBtn from '@/pages/TemplateDir/components/PlusBtn';
import Title from '@/pages/TemplateDir/components/Title';
import { useContext } from 'react';

export default () => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);
  const onCreateBaseInfo = () => {
    resumeData.content.baseInfo.list.push({
      key: 'key',
      value: 'value',
    });
    updateResume(resumeData);
  };

  return (
    <div className={`${resumeData.content.config.lineSpace}`}>
      <Title
        className={'!text-[32px]'}
        showIcon={false}
        value={resumeData.content.baseInfo.title}
        onChange={(v) => {
          resumeData.content.baseInfo.title = v;
          updateResume(resumeData);
        }}
      ></Title>
      <div className={'flex items-start justify-between space-x-2 text-zinc-600'}>
        <div className={'grid flex-1 grid-cols-3 gap-[1px] [&>div:nth-child(3n)]:!text-right'}>
          {resumeData.content.baseInfo.list.map((item, index) => (
            <DelGroup
              key={index}
              readOnly={readOnly}
              onDel={() => {
                resumeData.content.baseInfo.list.splice(index, 1);
                updateResume(resumeData);
              }}
            >
              <DivInput
                placeholder={'value'}
                className={`flex-1 pl-2 text-zinc-800`}
                value={item.value}
                onChange={(v) => {
                  resumeData.content.baseInfo.list[index].value = v;
                  updateResume(resumeData);
                }}
              />
            </DelGroup>
          ))}
          {!readOnly && <PlusBtn onClick={onCreateBaseInfo} />}
        </div>
      </div>
    </div>
  );
};
