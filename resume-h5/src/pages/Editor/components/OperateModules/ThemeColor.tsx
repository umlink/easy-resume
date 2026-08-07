import { presetThemeColors } from '@/constants/template-data';
import { ResumeDataContext } from '@/context';
import { configItemClass } from '@/pages/Editor/components/PreviewEditor';
import { useContext } from 'react';

export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const updateColor = (color: string) => {
    resumeData.content.config.themeColor = color;
    updateResume(resumeData, true);
  };

  return (
    <div className={configItemClass}>
      <b>主题色</b>
      <div className={'grid grid-cols-11 gap-1'}>
        {presetThemeColors.map((color) => {
          return (
            <span
              style={{ backgroundColor: color }}
              className={`flex h-5 w-5 cursor-pointer rounded-sm
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
