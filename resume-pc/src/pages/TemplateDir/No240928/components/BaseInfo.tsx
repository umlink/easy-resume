import DivInput from '@/components/DivInput';
import { ResumeDataContext } from '@/context';
import DelGroup from '@/pages/TemplateDir/components/DelGroup';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';
import PlusBtn from '@/pages/TemplateDir/components/PlusBtn';
import Title from '@/pages/TemplateDir/components/Title';
import { Fragment, useContext } from 'react';

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
    <div className={resumeData.content.config.lineSpace}>
      <Title
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
      <div className={'flex items-start justify-between space-x-2 text-zinc-600'}>
        <div className={'grid flex-1 grid-cols-2 gap-[1px]'}>
          {resumeData.content.baseInfo.list.map((item, index) => (
            <DelGroup
              key={index}
              readOnly={readOnly}
              onDel={() => {
                resumeData.content.baseInfo.list.splice(index, 1);
                updateResume(resumeData);
              }}
            >
              <Fragment>
                <DivInput
                  style={{ textAlignLast: 'justify' }}
                  textClass={'grid'}
                  className={`max-w-[64px] flex-1 text-justify ${readOnly ? 'pr-0' : 'max-w-[70px]'}`}
                  value={item.key}
                  placeholder={'key'}
                  onChange={(v) => {
                    resumeData.content.baseInfo.list[index].key = v;
                    updateResume(resumeData);
                  }}
                />
                {readOnly && <span className={'text-zinc-500'}>:</span>}
                <DivInput
                  placeholder={'value'}
                  className={`flex-1 text-zinc-800`}
                  value={item.value}
                  onChange={(v) => {
                    resumeData.content.baseInfo.list[index].value = v;
                    updateResume(resumeData);
                  }}
                />
              </Fragment>
            </DelGroup>
          ))}
          {!readOnly && <PlusBtn onClick={onCreateBaseInfo} />}
        </div>
        {resumeData.content.avatar.show && (
          <div className={'relative'}>
            <HeaderPhoto hasEdit />
          </div>
        )}
      </div>
    </div>
  );
};
