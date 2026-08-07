import DivInput from '@/components/DivInput';
import { ResumeDataContext } from '@/context';
import DelGroup from '@/pages/TemplateDir/components/DelGroup';
import PlusBtn from '@/pages/TemplateDir/components/PlusBtn';
import Title from '@/pages/TemplateDir/components/Title';
import { useContext } from 'react';

export default () => {
  const { resumeData, contrastColor, readOnly, updateResume } = useContext(ResumeDataContext);
  const onCreateBaseInfo = () => {
    resumeData.content.baseInfo.list.push({
      key: 'key',
      value: 'value',
    });
    updateResume(resumeData);
  };

  const step = 5;
  return (
    <div className={resumeData.content.config.lineSpace}>
      <Title
        themeColor={contrastColor}
        containerClass={'!border-b-0'}
        value={resumeData.content.baseInfo.title}
        icon={resumeData.content.baseInfo.icon}
        onSelectIcon={(v) => {
          resumeData.content.baseInfo.icon = v;
          updateResume(resumeData);
        }}
        onChange={(v) => {
          resumeData.content.baseInfo.title = v;
          updateResume(resumeData);
        }}
      ></Title>
      <div className={'space-y-[1px]'}>
        {resumeData.content.baseInfo.list.slice(step).map((item, index) => (
          <DelGroup
            key={index}
            readOnly={readOnly}
            onDel={() => {
              resumeData.content.baseInfo.list.splice(index + step, 1);
              updateResume(resumeData);
            }}
          >
            <>
              <DivInput
                style={{ color: contrastColor }}
                className={'max-w-[72px] flex-1 py-[2px]'}
                value={item.key}
                placeholder={'key'}
                onChange={(v) => {
                  resumeData.content.baseInfo.list[index + step].key = v;
                  updateResume(resumeData);
                }}
              />
              <DivInput
                style={{ color: contrastColor }}
                placeholder={'value'}
                className={`flex-1 py-[2px] text-right text-zinc-800`}
                value={item.value}
                onChange={(v) => {
                  resumeData.content.baseInfo.list[index + step].value = v;
                  updateResume(resumeData);
                }}
              />
            </>
          </DelGroup>
        ))}
        {!readOnly && <PlusBtn color={contrastColor} className={'py-1'} onClick={onCreateBaseInfo} />}
      </div>
    </div>
  );
};
