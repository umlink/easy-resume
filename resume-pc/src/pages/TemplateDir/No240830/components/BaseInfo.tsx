import DivInput from '@/components/DivInput';
import { ResumeDataContext } from '@/context';
import DelGroup from '@/pages/TemplateDir/components/DelGroup';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';
import PlusBtn from '@/pages/TemplateDir/components/PlusBtn';
import { useContext } from 'react';

const InfoItem = ({ item, index, step = 0 }: any) => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);
  return (
    <DelGroup
      readOnly={readOnly}
      onDel={() => {
        resumeData.content.baseInfo.list.splice(index + step, 1);
        updateResume(resumeData);
      }}
    >
      <DivInput
        placeholder={'value'}
        className={`px-2 text-zinc-800`}
        value={item.value}
        onChange={(v) => {
          resumeData.content.baseInfo.list[index + step].value = v;
          updateResume(resumeData);
        }}
      />
    </DelGroup>
  );
};

export default () => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);
  const onCreateBaseInfo = () => {
    resumeData.content.baseInfo.list.push({
      key: 'key',
      value: 'value',
    });
    updateResume(resumeData);
  };

  const array1 = resumeData.content.baseInfo.list.slice(1, 4);
  const array2 = resumeData.content.baseInfo.list.slice(4);

  return (
    <div className={'space-y-3 pb-2'}>
      <div className={'flex items-start justify-between space-x-4 text-zinc-700'}>
        <div className={'flex-1 space-y-1'}>
          <DivInput
            placeholder={'value'}
            style={{ color: resumeData.content.config.themeColor }}
            className={`w-full text-[26px] font-semibold`}
            value={resumeData.content.baseInfo.list[0]?.value}
            onChange={(v) => {
              resumeData.content.baseInfo.list[0].value = v;
              updateResume(resumeData);
            }}
          />
          <div className={'flex flex-1 flex-wrap space-x-1'}>
            {array1.map((item, index) => {
              return <InfoItem key={index} item={item} index={index} step={1} />;
            })}
          </div>
          <div className={'flex flex-1 flex-wrap space-x-1'}>
            {array2.map((item, index) => {
              return <InfoItem key={index} item={item} index={index} step={4} />;
            })}
          </div>
          {!readOnly && <PlusBtn className={'mt-1 w-[80px]'} onClick={onCreateBaseInfo}></PlusBtn>}
        </div>
        {resumeData.content.avatar.show && (
          <div className={'relative min-w-[110px] pr-1'}>
            <HeaderPhoto className={'absolute left-0 top-2'} size={110} round hasEdit />
          </div>
        )}
      </div>
    </div>
  );
};
