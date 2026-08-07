import DivInput from '@/components/DivInput';
import IconsSVG, { IconsMap } from '@/components/IconsSVG';
import { ResumeDataContext } from '@/context';
import { Fill } from '@icon-park/react';
import { useContext } from 'react';

const InfoItem = ({ item, index, step = 0 }: any) => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);
  const updateBaseInfoIcon = (name: string) => {
    resumeData.content.baseInfo.list[index + step].icon = name;
    updateResume(resumeData);
  };
  const InfoIcon = IconsMap[item.icon] || Fill;
  return (
    <div
      key={index}
      className={`group relative mr-2 flex items-center rounded-sm text-zinc-600 ${
        readOnly ? '' : 'min-w-[80px] space-x-1 hover:outline hover:outline-1 hover:outline-zinc-900'
      }`}
    >
      <IconsSVG readOnly={readOnly} onSelect={updateBaseInfoIcon}>
        <InfoIcon className={'text-[18px]'} />
      </IconsSVG>
      <DivInput
        placeholder={'value'}
        value={item.value}
        onChange={(v) => {
          resumeData.content.baseInfo.list[index + step].value = v;
          updateResume(resumeData);
        }}
      />
    </div>
  );
};

export default () => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);

  const array1 = resumeData.content.baseInfo.list.slice(1, 5);

  return (
    <div className={'my-4 flex items-start justify-between space-x-4 text-zinc-700'}>
      <div className={'flex-1'}>
        <DivInput
          placeholder={'value'}
          className={`w-full text-[28px] font-semibold text-zinc-800`}
          value={resumeData.content.baseInfo.list[0]?.value}
          onChange={(v) => {
            resumeData.content.baseInfo.list[0].value = v;
            updateResume(resumeData);
          }}
        />
        {(!readOnly || !!resumeData.content.config.desc) && (
          <DivInput
            placeholder={'其他信息'}
            className={`w-full py-[2px] pl-0 text-[16px] text-zinc-600`}
            value={resumeData.content.config.desc}
            onChange={(v) => {
              resumeData.content.config.desc = v;
              updateResume(resumeData);
            }}
          />
        )}
        <div className={'flex flex-1 flex-wrap'}>
          {array1.map((item, index) => {
            return <InfoItem key={index} item={item} index={index} step={1} />;
          })}
        </div>
      </div>
    </div>
  );
};
