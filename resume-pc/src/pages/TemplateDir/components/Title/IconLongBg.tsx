import DivInput from '@/components/DivInput';
import { TitlePropsType } from '@/pages/TemplateDir/components/Title/index';
import TitleIcons from '@/pages/TemplateDir/components/TitleIcons';
import { getHexColorByAlpha } from '@/utils/tools';

export default (props: TitlePropsType) => {
  const bgColor = getHexColorByAlpha(props.themeColor!, 0.05);
  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderBottom: `1px solid ${props.borderColor}`,
      }}
      className={'flex items-center rounded-t'}
    >
      {props.showIcon && (
        <span
          className={'flex items-center justify-center rounded-sm pl-2 leading-none'}
          style={{ fontSize: Number(props.size) + 2, color: props.themeColor }}
        >
          <TitleIcons readOnly={props.readonly} onSelect={props.onSelectIcon} type={props.icon} />
        </span>
      )}
      <DivInput
        className={`flex w-full items-center pl-2 font-semibold ${props.className}`}
        style={{ color: props.themeColor, fontSize: props.size }}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
