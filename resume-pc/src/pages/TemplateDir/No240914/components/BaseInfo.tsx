import DivInput from '@/components/DivInput';
import IconsSVG, { IconsMap } from '@/components/IconsSVG';
import { ResumeDataContext } from '@/context';
import DelGroup from '@/pages/TemplateDir/components/DelGroup';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';
import PlusBtn from '@/pages/TemplateDir/components/PlusBtn';
import { getHexColorByAlpha } from '@/utils/tools';
import { Fill } from '@icon-park/react';
import { useContext } from 'react';

const InfoItem = ({ item, index, step }: any) => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);
  const updateBaseInfoIcon = (icon: string, index: number) => {
    resumeData.content.baseInfo.list[index].icon = icon;
    updateResume(resumeData);
  };
  const InfoIcon = item.icon ? IconsMap[item.icon] : Fill;
  return (
    <DelGroup
      key={index}
      readOnly={readOnly}
      onDel={() => {
        resumeData.content.baseInfo.list.splice(index + step, 1);
        updateResume(resumeData);
      }}
    >
      <>
        <IconsSVG readOnly={readOnly} onSelect={(icon) => updateBaseInfoIcon(icon, index + step)}>
          <InfoIcon className={'text-[16px]'} style={{ color: resumeData.content.config.themeColor }} />
        </IconsSVG>
        <DivInput
          style={{ textAlignLast: 'justify' }}
          textClass={'grid'}
          className={`max-w-[64px] flex-1 py-[2px] text-justify ${readOnly ? 'pr-[2px]' : 'max-w-[70px]'}`}
          value={item.key}
          placeholder={'key'}
          onChange={(v) => {
            resumeData.content.baseInfo.list[index + step].key = v;
            updateResume(resumeData);
          }}
        />
        {readOnly && <span>:</span>}
        <DivInput
          placeholder={'value'}
          className={`flex-1 py-[2px] ${readOnly ? 'pl-[2px]' : ''}`}
          value={item.value}
          onChange={(v) => {
            resumeData.content.baseInfo.list[index + step].value = v;
            updateResume(resumeData);
          }}
        />
      </>
    </DelGroup>
  );
};

export default () => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);
  const bgColor = getHexColorByAlpha(resumeData.content.config.themeColor, 0.08);
  const onCreateBaseInfo = () => {
    resumeData.content.baseInfo.list.push({
      key: 'key',
      value: 'value',
    });
    updateResume(resumeData);
  };

  const array1 = resumeData.content.baseInfo.list.slice(1, 7);

  return (
    <div className={'pb-2'}>
      <div
        style={{ backgroundColor: resumeData.content.config.themeColor }}
        className={'flex items-end justify-between space-x-4 px-[30px] text-zinc-50'}
      >
        <div className={'flex-1 pb-2'}>
          <DivInput
            placeholder={'value'}
            className={`w-full !py-0 text-[24px] font-semibold`}
            value={resumeData.content.baseInfo.list[0]?.value}
            onChange={(v) => {
              resumeData.content.baseInfo.list[0].value = v;
              updateResume(resumeData);
            }}
          />
          {!!resumeData.content.config.desc && (
            <DivInput
              placeholder={'其他信息'}
              className={`w-full !py-0 text-[15px]`}
              value={resumeData.content.config.desc}
              onChange={(v) => {
                resumeData.content.config.desc = v;
                updateResume(resumeData);
              }}
            />
          )}
        </div>
        {resumeData.content.avatar.show && (
          <div className={'relative'}>
            <HeaderPhoto className={'absolute left-0 top-10'} width={110} height={140} hasEdit />
          </div>
        )}
      </div>
      <div
        style={{ backgroundColor: bgColor, color: resumeData.content.config.themeColor }}
        className={'grid flex-1 grid-cols-2 gap-x-1 gap-y-[1px] px-5 py-[10px] text-[14px]'}
      >
        {array1.map((item, index) => {
          return <InfoItem item={item} key={item.id} index={index} step={1} />;
        })}
        {!readOnly && <PlusBtn className={'h-[21px]'} onClick={onCreateBaseInfo}></PlusBtn>}
      </div>
    </div>
  );
};
