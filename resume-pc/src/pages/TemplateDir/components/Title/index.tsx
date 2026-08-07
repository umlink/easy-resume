import { ResumeDataContext } from '@/context';
import { getHexColorByAlpha } from '@/utils/tools';
import { useContext } from 'react';
import ET1 from './ET1';
import ET2 from './ET2';
import ET3 from './ET3';
import ET4 from './ET4';
import ET5 from './ET5';
import ET6 from './ET6';
import ET7 from './ET7';
import IconLongBg from './IconLongBg';
import IconRoundBg from './IconRoundBg';
import RoundBgLine from './RoundBgLine';
import RoundLongShallowBg from './RoundLongShallowBg';
import RoundLongLineShallowBg from './RoundLongLineShallowBg';
import RoundDarkOblique from './RoundDarkOblique';
import RoundLineBgLine from './RoundLineBgLine';

type EntryTitleProps = {
  value: string;
  icon?: string;
  showIcon?: boolean;
  pIndex?: number;
  themeColor?: string;
  className?: string;
  containerClass?: string;
  onChange?: (v: string) => void;
  onSelectIcon?: (type: string) => void;
};

export type TitlePropsType = {
  value: string;
  icon?: string;
  readonly: boolean;
  onChange: (v: string) => void;
  onSelectIcon: (type: string) => void;
  className?: string;
  containerClass?: string;
  themeColor?: string;
  size?: number;
  showIcon?: boolean;
  borderColor?: string;
  enableTheme?: boolean;
  contrastColor?: string;
};
export default (props: EntryTitleProps) => {
  const TitleMap: Record<string, (props: TitlePropsType) => JSX.Element> = {
    ET1,
    ET2,
    ET3,
    ET4,
    ET5,
    RoundDarkOblique,
    ET6,
    ET7,
    IconLongBg,
    IconRoundBg,
    RoundBgLine,
    RoundLongShallowBg,
    RoundLineBgLine,
    RoundLongLineShallowBg,
  };
  const { resumeData, readOnly, contrastColor, updateResume } = useContext(ResumeDataContext);

  const { entryTitleTheme, entryTitleMode, entryTitleSize, entryTitleBorderShade, themeColor } =
    resumeData.content.config;

  const Title = TitleMap[entryTitleMode || 'ET1'];
  // 主题颜色 - 字体
  const tColor = entryTitleTheme ? props.themeColor || themeColor : '#010101';
  // 边框颜色深度
  const borderShade = entryTitleBorderShade ?? 0.3;
  // 边框颜色
  const borderColor = getHexColorByAlpha(tColor, borderShade);

  const { pIndex = undefined } = props;
  const onChangeTitle = (title: string) => {
    if (pIndex !== undefined) {
      resumeData.content.entryList[pIndex].title = title;
      updateResume(resumeData);
    }
    props.onChange?.(title);
  };

  const onSelectIcon = (icon: string) => {
    if (pIndex !== undefined) {
      resumeData.content.entryList[pIndex].icon = icon;
      updateResume(resumeData);
    }
    props.onSelectIcon?.(icon);
  };

  return (
    <Title
      value={props.value}
      icon={props.icon}
      showIcon={props.showIcon ?? resumeData.content.config.showEntryTitleIcon}
      readonly={readOnly}
      size={entryTitleSize || 16}
      themeColor={tColor}
      contrastColor={contrastColor}
      borderColor={borderColor}
      enableTheme={entryTitleTheme ?? true}
      onChange={onChangeTitle}
      className={props.className}
      containerClass={props.containerClass}
      onSelectIcon={onSelectIcon}
    />
  );
};
