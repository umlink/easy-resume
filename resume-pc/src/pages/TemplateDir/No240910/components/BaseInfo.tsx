import DivInput from '@/components/DivInput';
import IconsSVG, { IconsMap } from '@/components/IconsSVG';
import { ResumeDataContext } from '@/context';
import DelGroup from '@/pages/TemplateDir/components/DelGroup';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';
import PlusBtn from '@/pages/TemplateDir/components/PlusBtn';
import { Fill } from '@icon-park/react';
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

  const updateBaseInfoIcon = (icon: string, index: number) => {
    resumeData.content.baseInfo.list[index].icon = icon;
    updateResume(resumeData);
  };

  return (
    <div className={`flex items-end justify-between`}>
      <div className={`${resumeData.content.config.lineSpace} mr-4 flex-1`}>
        <DivInput
          placeholder={'value'}
          className={`w-full py-0 text-[24px] font-semibold`}
          style={{ color: `${resumeData.content.config.themeColor}` }}
          value={resumeData.content.baseInfo.list[0]?.value}
          onChange={(v) => {
            resumeData.content.baseInfo.list[0].value = v;
            updateResume(resumeData);
          }}
        />
        {(!!resumeData.content.config.desc || !readOnly) && (
          <DivInput
            placeholder={'其他信息'}
            className={`w-full !py-0 text-[15px] text-zinc-600`}
            value={resumeData.content.config.desc}
            onChange={(v) => {
              resumeData.content.config.desc = v;
              updateResume(resumeData);
            }}
          />
        )}
        <div className={'flex items-start justify-between text-zinc-600'}>
          <div className={'grid flex-1 grid-cols-2 gap-x-1 gap-y-[1px] pb-2'}>
            {resumeData.content.baseInfo.list.slice(1).map((item, i) => {
              const index = i + 1;
              const InfoIcon = item.icon ? IconsMap[item.icon] : Fill;
              return (
                <DelGroup
                  key={index}
                  readOnly={readOnly}
                  onDel={() => {
                    resumeData.content.baseInfo.list.splice(index, 1);
                    updateResume(resumeData);
                  }}
                >
                  <Fragment>
                    <IconsSVG readOnly={readOnly} onSelect={(icon) => updateBaseInfoIcon(icon, index)}>
                      <InfoIcon className={'text-[15px]'} style={{ color: resumeData.content.config.themeColor }} />
                    </IconsSVG>
                    <DivInput
                      style={{ textAlignLast: 'justify' }}
                      textClass={'grid'}
                      className={`max-w-[64px] flex-1 py-[2px] text-justify ${readOnly ? 'pr-0' : 'max-w-[70px]'}`}
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
                      className={`flex-1 py-[2px] text-zinc-500`}
                      value={item.value}
                      onChange={(v) => {
                        resumeData.content.baseInfo.list[index].value = v;
                        updateResume(resumeData);
                      }}
                    />
                  </Fragment>
                </DelGroup>
              );
            })}
            {!readOnly && <PlusBtn onClick={onCreateBaseInfo} />}
          </div>
        </div>
      </div>
      {resumeData.content.avatar.show && (
        <div className={'pb-5'}>
          <HeaderPhoto />
        </div>
      )}
    </div>
  );
};
