import { CloseOne } from '@icon-park/react';

type PropsType = {
  readOnly: boolean;
  onDel: () => void;
  children: JSX.Element;
};
export default (props: PropsType) => {
  return (
    <div
      className={`group/del relative
        flex items-center justify-between
        space-x-[1px]
        ${props.readOnly ? '' : ' hover:outline hover:outline-1 hover:outline-zinc-900'}`}
    >
      {props.children}
      {!props.readOnly && (
        <span
          onClick={props.onDel}
          className={`absolute right-[-8px] top-[-8px]
            hidden
            cursor-pointer rounded-full
            bg-white/80 leading-none text-zinc-600
            group-hover/del:inline-block`}
        >
          <CloseOne theme="outline" size="18" strokeWidth={5} />
        </span>
      )}
    </div>
  );
};
