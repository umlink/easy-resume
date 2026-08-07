import DivInput from '@/components/DivInput';
import { TitlePropsType } from '@/pages/TemplateDir/components/Title/index';
import TitleIcons from '@/pages/TemplateDir/components/TitleIcons';
import { getHexColorByAlpha } from '@/utils/tools';

export default (props: TitlePropsType) => {
  const bgColor = getHexColorByAlpha(props.themeColor!, 0.06);
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to right, ${bgColor}, white)`,
      }}
      className={'flex items-stretch'}
    >
      {props.showIcon && (
        <span
          className={'inline-block aspect-1/1 h-auto rounded rounded-br-none px-1.5'}
          style={{ fontSize: Number(props.size), backgroundColor: props.themeColor }}
        >
          <span className={'flex h-full w-full items-center !text-white'}>
            <TitleIcons readOnly={props.readonly} onSelect={props.onSelectIcon} type={props.icon} />
          </span>
        </span>
      )}
      <DivInput
        className={`flex w-full items-center !rounded-none py-[2px] pl-2 font-semibold ${props.className}`}
        style={{ color: props.themeColor, fontSize: props.size, borderBottom: `1px solid ${props.borderColor}` }}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};
