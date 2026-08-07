import DivInput from '@/components/DivInput';
import { TitlePropsType } from '@/pages/TemplateDir/components/Title/index';
import TitleIcons from '@/pages/TemplateDir/components/TitleIcons';

export default (props: TitlePropsType) => {
  return (
    <div className={'flex'}>
      <div className={'flex items-center font-semibold'} style={{ borderBottom: `2px solid ${props.themeColor}` }}>
        {props.showIcon && (
          <span
            className={'mr-1 flex items-center justify-center pl-1.5 leading-none'}
            style={{ color: props.themeColor, fontSize: Number(props.size) + 2 }}
          >
            <TitleIcons readOnly={props.readonly} onSelect={props.onSelectIcon} type={props.icon} />
          </span>
        )}
        <DivInput
          style={{ color: props.themeColor, fontSize: props.size }}
          className={`min-w-[72px] ${props.className}`}
          value={props.value}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
};
