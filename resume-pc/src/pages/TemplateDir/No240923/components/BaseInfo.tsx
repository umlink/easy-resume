import DivInput from '@/components/DivInput';
import { ResumeDataContext } from '@/context';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';
import { useContext } from 'react';
import IconsSVG, { IconsMap } from '@/components/IconsSVG';
import { Fill } from '@icon-park/react';

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
      className={`group relative flex items-center rounded-sm text-zinc-600 ${
        readOnly ? '' : 'min-w-[80px] space-x-1 hover:outline hover:outline-1 hover:outline-zinc-900'
      }`}
    >
      <IconsSVG readOnly={readOnly} onSelect={updateBaseInfoIcon}>
        <InfoIcon style={{ color: resumeData.content.config.themeColor }} className={'!text-[18px]'} />
      </IconsSVG>
      <DivInput
        placeholder={'value'}
        value={item.value}
        className={'w-full !py-0'}
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

  return (
    <div className={'relative'}>
      <div className={'flex items-start justify-between text-zinc-600'}>
        {resumeData.content.avatar.show && (
          <div className={'relative mr-6'}>
            <HeaderPhoto className={'absolute left-0 top-0'} hasEdit />
          </div>
        )}
        <div className={'flex-1 space-y-2'}>
          <DivInput
            placeholder={'value'}
            className={`w-full !py-0 text-[26px] font-semibold text-zinc-800`}
            value={resumeData.content.baseInfo.list[0]?.value}
            onChange={(v) => {
              resumeData.content.baseInfo.list[0].value = v;
              updateResume(resumeData);
            }}
          />
          {(!readOnly || !!resumeData.content.config.desc) && (
            <div className={'border-b border-b-zinc-100'}>
              <DivInput
                placeholder={'其他信息'}
                className={`w-full !py-0 text-[18px] text-zinc-600`}
                value={resumeData.content.config.desc}
                onChange={(v) => {
                  resumeData.content.config.desc = v;
                  updateResume(resumeData);
                }}
              />
            </div>
          )}
          <div className={'mt-2 flex items-center justify-between'}>
            {resumeData.content.baseInfo.list.slice(1, 6).map((item, index) => {
              return <InfoItem item={item} index={index} step={1} key={index} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
