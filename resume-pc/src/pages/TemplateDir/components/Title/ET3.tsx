import DivInput from '@/components/DivInput';
import { TitlePropsType } from '@/pages/TemplateDir/components/Title/index';
import TitleIcons from '@/pages/TemplateDir/components/TitleIcons';

export default (props: TitlePropsType) => {
  return (
    <div className={'flex items-center font-semibold'}>
      {props.showIcon && (
        <span
          className={'mr-1 flex items-center justify-center leading-none'}
          style={{ color: props.themeColor, fontSize: Number(props.size) + 2 }}
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
