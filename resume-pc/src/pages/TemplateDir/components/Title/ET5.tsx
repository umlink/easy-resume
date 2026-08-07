import DivInput from '@/components/DivInput';
import { TitlePropsType } from '@/pages/TemplateDir/components/Title/index';
import TitleIcons from '@/pages/TemplateDir/components/TitleIcons';

export default (props: TitlePropsType) => {
  return (
    <div className={'flex'} style={{ borderBottom: `1px solid ${props.borderColor}` }}>
      <div style={{ backgroundColor: props.themeColor }} className={'flex w-auto min-w-[80px] rounded-t-sm'}>
        {props.showIcon && (
          <span
            className={'mr-[1px] flex items-center justify-center pl-2 leading-none'}
            style={{ color: props.contrastColor, fontSize: Number(props.size) + 2 }}
          >
            <TitleIcons readOnly={props.readonly} onSelect={props.onSelectIcon} type={props.icon} />
          </span>
        )}
        <DivInput
          style={{ color: props.contrastColor, fontSize: props.size }}
          className={`rounded-0 flex-1 px-2`}
          value={props.value}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
};
