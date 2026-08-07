import { presetThemeColors } from '@/constants/template-data';
import { ResumeDataContext } from '@/context';
import { Button, ColorPicker, Tooltip } from 'antd';
import React, { useContext } from 'react';

const ThemeColor = (): JSX.Element => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);

  const updateColor = (color: string) => {
    resumeData.content.config.themeColor = color;
    updateResume(resumeData);
  };

  return (
    <div className={'py-3'}>
      <div className={'mb-3 flex items-center justify-between'}>
        <span className={'g-line-before-title'}>主题色</span>
        <ColorPicker
          placement={'bottomRight'}
          format={'hex'}
          presets={[
            {
              label: '预设',
              colors: presetThemeColors,
            },
          ]}
          value={resumeData.content.config.themeColor}
          onChange={(val) => updateColor(val.toHexString())}
        >
          <Tooltip title="自定义颜色" placement={'top'}>
            <Button
              size={'small'}
              className={'!p-[2px]'}
              icon={
                <span
                  className={'flex h-[18px] w-[18px] rounded-md'}
                  style={{ backgroundColor: resumeData.content.config.themeColor }}
                ></span>
              }
            ></Button>
          </Tooltip>
        </ColorPicker>
      </div>
      <div className={'grid grid-cols-10 gap-1'}>
        {presetThemeColors.map((color) => {
          return (
            <span
              style={{ backgroundColor: color }}
              className={`flex h-5 w-5 cursor-pointer rounded-md
              hover:outline-dashed hover:outline-[1px]
              hover:outline-offset-1 hover:outline-zinc-700`}
              key={color}
              onClick={() => updateColor(color)}
            ></span>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeColor;
