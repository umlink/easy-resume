import DivInput from '@/components/DivInput';
import IconsSVG, { IconsMap } from '@/components/IconsSVG';
import { ResumeDataContext } from '@/context';
import { Fill } from '@icon-park/react';
import { Divider, Space } from 'antd';
import { useContext } from 'react';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';

export default () => {
  const { resumeData, contrastColor, luma = 0, readOnly, updateResume } = useContext(ResumeDataContext);

  const step = 1;
  const updateBaseInfoIcon = (name: string, index: number) => {
    resumeData.content.baseInfo.list[index + step].icon = name;
    updateResume(resumeData);
  };

  return (
    <div
      className={'flex justify-between rounded-sm'}
      style={{ backgroundColor: resumeData.content.config.themeColor }}
    >
      {resumeData.content.avatar.show && (
        <div className={'w-[220px] min-w-[220px] p-5 text-center'}>
          <HeaderPhoto round size={110} />
        </div>
      )}
      <div className={`flex-1 pb-2 pl-1 pt-6 ${resumeData.content.avatar.show ? '' : 'pl-4'}`}>
        <DivInput
          placeholder={'value'}
          style={{ color: contrastColor }}
          className={`w-full pl-0 text-[32px] font-semibold text-zinc-800`}
          value={resumeData.content.baseInfo.list[0]?.value}
          onChange={(v) => {
            resumeData.content.baseInfo.list[0].value = v;
            updateResume(resumeData);
          }}
        />
        {(!readOnly || !!resumeData.content.config.desc) && (
          <DivInput
            placeholder={'其他信息'}
            style={{ color: contrastColor }}
            className={`w-full py-[2px] pl-0 text-zinc-600`}
            value={resumeData.content.config.desc}
            onChange={(v) => {
              resumeData.content.config.desc = v;
              updateResume(resumeData);
            }}
          />
        )}
        <Space size={0} split={<Divider type="vertical" />}>
          {resumeData.content.baseInfo.list.slice(1, 5).map((item, index) => {
            const InfoIcon = item.icon ? IconsMap[item.icon] : Fill;
            return (
              <span
                className={`flex items-center space-x-1 ${luma < 0.4 ? 'text-zinc-400' : 'text-zinc-600'}`}
                key={item.id}
              >
                <IconsSVG readOnly={readOnly} onSelect={(name) => updateBaseInfoIcon(name, index)}>
                  <InfoIcon className={'text-[16px]'} />
                </IconsSVG>
                <DivInput
                  className={'flex-1'}
                  placeholder={'value'}
                  value={item.value}
                  onChange={(v) => {
                    resumeData.content.baseInfo.list[index + step].value = v;
                    updateResume(resumeData);
                  }}
                />
              </span>
            );
          })}
        </Space>
      </div>
    </div>
  );
};
