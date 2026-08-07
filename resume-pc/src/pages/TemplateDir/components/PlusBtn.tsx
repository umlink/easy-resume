import { Plus } from '@icon-park/react';

type PropsType = {
  className?: string;
  onClick: () => void;
  color?: string;
};

export default (props: PropsType): JSX.Element => {
  return (
    <div
      onClick={props.onClick}
      style={{ color: props.color }}
      className={`flex
         h-[25px] cursor-pointer items-center justify-center
         py-0
         outline-dashed outline-1 outline-zinc-400 ${props.className}
         hover:font-bold hover:!outline hover:outline-zinc-900`}
    >
      <Plus />
      <span>添加</span>
    </div>
  );
};
