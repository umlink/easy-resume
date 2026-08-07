import DivInput from '@/components/DivInput';
import { TitlePropsType } from '@/pages/TemplateDir/components/Title/index';
import TitleIcons from '@/pages/TemplateDir/components/TitleIcons';

export default (props: TitlePropsType) => {
  return (
    <div style={{ borderBottom: `1px solid ${props.themeColor}` }} className={'flex'}>
      {props.showIcon && (
        <span
          className={'mr-1 flex items-center justify-center pl-1 leading-none'}
          style={{ color: props.themeColor, fontSize: Number(props.size) + 2 }}
        >
          <TitleIcons readOnly={props.readonly} onSelect={props.onSelectIcon} type={props.icon} />
        </span>
      )}
      <DivInput
        className={`flex-1 py-0 font-semibold ${props.className}`}
        style={{ color: props.themeColor, fontSize: props.size }}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
