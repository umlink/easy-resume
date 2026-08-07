import { ResumeDataContext } from '@/context';
import { Down } from '@icon-park/react';
import { Switch, InputNumber, Popover } from 'antd';
import React, { useContext } from 'react';

enum TitleEnum {
  ET1 = 'ET1',
  ET2 = 'ET2',
  ET3 = 'ET3',
  ET4 = 'ET4',
  ET5 = 'ET5',
  ET6 = 'ET6',
  ET7 = 'ET7',
  IconLongBg = 'IconLongBg',
  IconRoundBg = 'IconRoundBg',
  RoundBgLine = 'RoundBgLine',
  RoundLongShallowBg = 'RoundLongShallowBg',
  RoundDarkOblique = 'RoundDarkOblique',
  RoundLineBgLine = 'RoundLineBgLine',
  RoundLongLineShallowBg = 'RoundLongLineShallowBg',
}
const titleLabelMap: any = {
  [TitleEnum.ET1]: '基础常规',
  [TitleEnum.ET2]: '背景渐变',
  [TitleEnum.ET3]: '无底无边',
  [TitleEnum.ET4]: '短边无底',
  [TitleEnum.ET5]: '短深背景',
  [TitleEnum.ET7]: '浅边背景',
  [TitleEnum.ET6]: '英文专用',
  [TitleEnum.RoundDarkOblique]: '斜角深底',
  [TitleEnum.IconLongBg]: '长浅背景',
  [TitleEnum.IconRoundBg]: '圆角带边',
  [TitleEnum.RoundLongShallowBg]: '圆角带边浅底',
  [TitleEnum.RoundLongLineShallowBg]: '圆角带边渐变',
  [TitleEnum.RoundLineBgLine]: '小角带边渐变',
  [TitleEnum.RoundBgLine]: '小角标带边浅底',
};

export default () => {
  const { updateResume, resumeData } = useContext(ResumeDataContext);

  const titleIconOptions = Object.keys(titleLabelMap).map((key) => {
    return {
      label: titleLabelMap[key],
      value: key,
    };
  });

  const onHandlerMode = (val: string) => {
    resumeData.content.config.entryTitleMode = val;
    updateResume(resumeData);
  };

  const onHandlerSize = (size: number | null) => {
    resumeData.content.config.entryTitleSize = size || 16;
    updateResume(resumeData);
  };

  const onHandlerBorder = (shade: any) => {
    resumeData.content.config.entryTitleBorderShade = shade;
    updateResume(resumeData);
  };

  const onHandlerTheme = (checked: boolean) => {
    resumeData.content.config.entryTitleTheme = checked;
    updateResume(resumeData);
  };
  const onHandlerShowEntryIcon = (show: boolean) => {
    resumeData.content.config.showEntryTitleIcon = show;
    updateResume(resumeData);
  };

  return (
    <div className={'py-3'}>
      <div className={'mb-3 flex items-center justify-between'}>
        <span className={'g-line-before-title'}>模块标题</span>
        <Popover
          content={
            <div className={'grid grid-cols-2 gap-[2px]'}>
              {titleIconOptions.map((item) => {
                return (
                  <span
                    key={item.value}
                    onClick={() => onHandlerMode(item.value)}
                    className={'cursor-pointer rounded-sm bg-zinc-50 p-2 hover:bg-zinc-100'}
                  >
                    {item.label}
                  </span>
                );
              })}
            </div>
          }
          placement={'topRight'}
          trigger="hover"
        >
          <span className={'flex cursor-pointer items-center space-x-2 rounded-sm bg-zinc-100 px-2 py-1'}>
            <span>{titleLabelMap[resumeData.content.config.entryTitleMode || '']}</span>
            <Down theme="filled" />
          </span>
        </Popover>
      </div>
      <div className={'space-y-3 text-zinc-600'}>
        <div className={'flex items-center justify-between'}>
          <span>主题联动</span>
          <Switch size={'small'} checked={resumeData.content.config.entryTitleTheme} onChange={onHandlerTheme} />
        </div>
        <div className={'flex items-center justify-between'}>
          <span>显示图标</span>
          <Switch
            size={'small'}
            checked={resumeData.content.config.showEntryTitleIcon}
            onChange={onHandlerShowEntryIcon}
          />
        </div>
        <div className={'flex items-center justify-between'}>
          <span>标题大小</span>
          <InputNumber
            size={'small'}
            min={14}
            max={20}
            style={{ width: 100, textAlign: 'center' }}
            variant="filled"
            value={resumeData.content.config.entryTitleSize}
            onChange={onHandlerSize}
          />
        </div>
        <div className={'flex items-center justify-between'}>
          <span>边框颜色深度</span>
          <InputNumber
            size={'small'}
            step={0.1}
            min={0}
            max={1}
            style={{ width: 100, textAlign: 'center' }}
            variant="filled"
            value={resumeData.content.config.entryTitleBorderShade || 0}
            onChange={onHandlerBorder}
          />
        </div>
      </div>
    </div>
  );
};
