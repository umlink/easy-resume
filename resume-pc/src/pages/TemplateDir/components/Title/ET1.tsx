import DivInput from '@/components/DivInput';
import { TitlePropsType } from '@/pages/TemplateDir/components/Title/index';
import TitleIcons from '@/pages/TemplateDir/components/TitleIcons';

export default (props: TitlePropsType) => {
  return (
    <div
      style={{ borderBottom: `1px solid ${props.borderColor}` }}
      className={`border-1 leading-1 flex items-center font-semibold ${props.containerClass}`}
    >
      {props.showIcon && (
        <span
          className={'mr-[2px] flex items-center justify-center leading-none'}
          style={{ color: props.themeColor, fontSize: Number(props.size) + 3 }}
        >
          <TitleIcons readOnly={props.readonly} onSelect={props.onSelectIcon} type={props.icon} />
        </span>
      )}
      <DivInput
        style={{ color: props.themeColor, fontSize: props.size }}
        className={`flex-1 ${props.className}`}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
