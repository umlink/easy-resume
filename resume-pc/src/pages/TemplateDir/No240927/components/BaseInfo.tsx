import DivInput from '@/components/DivInput';
import { ResumeDataContext } from '@/context';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';
import PlusBtn from '@/pages/TemplateDir/components/PlusBtn';
import { Fragment, useContext } from 'react';
import DelGroup from '@/pages/TemplateDir/components/DelGroup';

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
      <div className={'flex items-start justify-between space-x-2 text-zinc-600'}>
        <div className={'flex flex-col  space-y-[1px] font-bold'}>
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
                  placeholder={'key'}
                  className={`py-[1px] text-zinc-800`}
                  value={item.key}
                  onChange={(v) => {
                    resumeData.content.baseInfo.list[index].key = v;
                    updateResume(resumeData);
                  }}
                />
                <DivInput
                  placeholder={'value'}
                  className={`min-w-[300px] flex-1 py-[1px] text-zinc-800`}
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
          <div className={'relative min-w-[100px] pr-1'}>
            <HeaderPhoto className={'absolute left-0 top-2'} round size={110} hasEdit />
          </div>
        )}
      </div>
    </div>
  );
};
