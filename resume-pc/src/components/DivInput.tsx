import { ResumeDataContext } from '@/context';
import { useKeyPress } from 'ahooks';
import { useContext, useEffect, useRef } from 'react';

type DivInputPropsType = {
  value?: any;
  onChange?: (v: string) => void;
  className?: string;
  textClass?: string;
  placeholder?: string;
  style?: any;
  lineEntry?: boolean;
};

const DivInput = (props: DivInputPropsType) => {
  const { readOnly } = useContext(ResumeDataContext);
  const { placeholder, style } = props;
  const ref = useRef<any>(null);
  const handleInput = (e: any) => {
    let valText = e.target.innerText;
    // 处理粘贴后含有标签的情况，强行去除嵌套标签
    // if (valHtml !== valText && !props.lineEntry) {
    //   ref.current.innerText = valText;
    // }
    // 处理为空含有 \n 的情况
    valText = valText === '\n' ? '' : valText;
    props.onChange?.(valText);
  };

  useKeyPress(
    'enter',
    (e: Event) => {
      if (!props.lineEntry) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    {
      target: ref,
    },
  );

  useEffect(() => {
    if (ref) {
      const currentVal = ref.current!.innerText;
      if (currentVal !== props.value) {
        ref.current!.innerText = props.value ?? '';
      }
    }
  }, [props.value]);

  const editHover = 'hover:shadow-md outline-zinc-400 hover:outline-zinc-900';
  return (
    <div
      style={style}
      className={`group/input inline-block
          min-w-8 overflow-hidden rounded-sm
          p-1 outline-dashed  outline-1
          ${readOnly ? 'outline-transparent' : editHover}
          ${props.className}`}
    >
      <div
        ref={ref}
        contentEditable={!readOnly}
        onInput={handleInput}
        placeholder={placeholder ?? 'content'}
        className={`div-input leading-1 no-scrollbar
          relative w-full cursor-text
          overflow-x-auto whitespace-nowrap
          caret-fuchsia-600 outline-none
          before:absolute
          before:left-[2px] before:right-[2px] before:top-0
          before:font-light before:text-zinc-600/50
          ${props.textClass}
          ${props.value ? '' : 'before:content-[attr(placeholder)]'}`}
      />
    </div>
  );
};

export default DivInput;
