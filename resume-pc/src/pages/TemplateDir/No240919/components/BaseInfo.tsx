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
      <div className={'flex items-center space-x-[1px]'} style={{ color: resumeData.content.config.themeColor }}>
        <IconsSVG readOnly={readOnly} onSelect={(icon) => updateBaseInfoIcon(icon, index + step)}>
          <InfoIcon className={'flex text-[15px]'} />
        </IconsSVG>
        <DivInput
          className={`max-w-[64px] py-0 ${readOnly ? 'pl-[2px] pr-0' : 'max-w-[70px]'}`}
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
          className={`flex-1 py-0 ${readOnly ? 'pl-[2px]' : ''}`}
          value={item.value}
          onChange={(v) => {
            resumeData.content.baseInfo.list[index + step].value = v;
            updateResume(resumeData);
          }}
        />
      </div>
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
        className={'flex items-end justify-between space-x-4 px-[30px] pt-5 text-zinc-50'}
      >
        <div className={'flex-1 pb-3'}>
          <DivInput
            placeholder={'value'}
            className={`w-full text-[28px] font-semibold`}
            value={resumeData.content.baseInfo.list[0]?.value}
            onChange={(v) => {
              resumeData.content.baseInfo.list[0].value = v;
              updateResume(resumeData);
            }}
          />
          {(!!resumeData.content.config.desc || !readOnly) && (
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
            <HeaderPhoto className={'absolute left-0 top-5'} width={110} height={140} hasEdit />
          </div>
        )}
      </div>
      <div style={{ backgroundColor: bgColor }} className={'flex items-center space-x-3 px-5 py-3'}>
        {array1.map((item, index) => {
          return <InfoItem item={item} key={item.id} index={index} step={1} />;
        })}
        {!readOnly && resumeData.content.baseInfo.list.length < 6 && (
          <PlusBtn className={'h-[21px] w-[80px]'} onClick={onCreateBaseInfo}></PlusBtn>
        )}
      </div>
    </div>
  );
};
