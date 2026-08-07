import DivInput from '@/components/DivInput';
import { TitlePropsType } from '@/pages/TemplateDir/components/Title/index';
import TitleIcons from '@/pages/TemplateDir/components/TitleIcons';
import { getHexColorByAlpha } from '@/utils/tools';

export default (props: TitlePropsType) => {
  const bgColor = getHexColorByAlpha(props.themeColor!, 0.04);
  return (
    <div
      style={{
        borderColor: props.borderColor,
        backgroundImage: `linear-gradient(to right, ${bgColor}, white)`,
      }}
      className={'flex items-center border-b'}
    >
      {props.showIcon && (
        <span
          className={'mr-1 flex items-center justify-center pl-2 leading-none'}
          style={{ color: props.themeColor, fontSize: Number(props.size) + 2 }}
        >
          <TitleIcons readOnly={props.readonly} onSelect={props.onSelectIcon} type={props.icon} />
        </span>
      )}
      <DivInput
        className={`w-full font-semibold ${props.className}`}
        style={{ color: props.themeColor, fontSize: props.size }}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
