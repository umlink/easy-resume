import DivInput from '@/components/DivInput';
import { TitlePropsType } from '@/pages/TemplateDir/components/Title/index';
import TitleIcons from '@/pages/TemplateDir/components/TitleIcons';

export default (props: TitlePropsType) => {
  return (
    <div className={'flex rounded-bl-xl'} style={{ borderBottom: `1px solid ${props.borderColor}` }}>
      <div
        style={{ backgroundColor: props.themeColor }}
        className={'flex w-auto min-w-[80px] rounded-t-sm rounded-bl-xl rounded-tr-xl pr-2'}
      >
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
          className={`rounded-0 flex flex-1 items-center px-2`}
          value={props.value}
          onChange={props.onChange}
        />
      </div>
    </div>
  );
};
