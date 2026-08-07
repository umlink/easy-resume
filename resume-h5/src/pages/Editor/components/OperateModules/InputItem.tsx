import { Input } from 'antd-mobile';
type InputItemPropsType = {
  label: string;
  value?: string | number;
  placeholder: string;
  width?: number;
  onChange: (v: string) => void;
};
export default (props: InputItemPropsType) => {
  const { label, value, placeholder, width, onChange } = props;
  return (
    <span className={'flex items-center space-x-1'}>
      <span>{label}:</span>
      <Input
        value={`${value}`}
        style={{ width }}
        className={'border border-zinc-100 bg-zinc-100 px-2 rounded [&_.adm-input-element]:text-center'}
        type={'number'}
        placeholder={placeholder}
        onChange={onChange}
      />
    </span>
  );
};
