import DivInput from '@/components/DivInput';
import IconsSVG, { IconsMap } from '@/components/IconsSVG';
import { ResumeDataContext } from '@/context';
import { getHexColorByAlpha } from '@/utils/tools';
import { Fill } from '@icon-park/react';
import { Divider, Space } from 'antd';
import { useContext } from 'react';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';

export default () => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);

  const step = 1;
  const updateBaseInfoIcon = (name: string, index: number) => {
    resumeData.content.baseInfo.list[index + step].icon = name;
    updateResume(resumeData);
  };

  const bgColor = getHexColorByAlpha(resumeData.content.config.themeColor, 0.02);

  return (
    <div
      style={{ backgroundColor: bgColor, borderRadius: resumeData.content.avatar.radius }}
      className={'flex justify-between rounded-b !bg-gray-200'}
    >
      {resumeData.content.avatar.show && <HeaderPhoto width={200} height={150} hasEdit />}
      <div className={`flex-1 py-4 pb-3 ${resumeData.content.avatar.show ? 'px-5' : 'px-4'}`}>
        <DivInput
          lineEntry
          placeholder={'value'}
          style={{ color: resumeData.content.config.themeColor }}
          className={`w-full pl-0 text-[26px] font-semibold`}
          value={resumeData.content.baseInfo.list[0]?.value}
          onChange={(v) => {
            resumeData.content.baseInfo.list[0].value = v;
            updateResume(resumeData);
          }}
        />
        {(!readOnly || !!resumeData.content.config.desc) && (
          <DivInput
            lineEntry
            placeholder={'其他信息'}
            className={`w-full py-[2px] pl-0 text-[18px] text-zinc-600`}
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
              <span className={'flex items-center space-x-1 text-zinc-600'} key={item.id}>
                <IconsSVG readOnly={readOnly} onSelect={(name) => updateBaseInfoIcon(name, index)}>
                  <InfoIcon className={'text-[14px]'} />
                </IconsSVG>
                <DivInput
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
