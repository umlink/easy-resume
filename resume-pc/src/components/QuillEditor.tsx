import '@/assets/less/quill-editor.less';
import Quill, { QuillOptions } from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import { useEffect, useRef } from 'react';

export type EditModeType = 'bubble' | 'snow';

type PropsType = {
  html: string;
  luma?: number;
  readOnly?: boolean;
  isSimple?: boolean;
  placeholder?: string;
  contrastColor?: string;
  theme?: EditModeType;
  className?: string;
  onChange?: (v: string) => void;
};
const contentStyle = `
      rounded-sm
      text-zinc-900
      [&_.ql-editor]:leading-[34px]
      [&_.ql-container]:!whitespace-pre-wrap
      [&_.ql-container]:h-auto
      [&_.ql-container]:text-[16px]
      [&_.ql-toolbar]:px-0
      [&_.ql-tooltip]:z-[99]
      [&_.ql-editor]:p-1
      [&_.ql-editor_p]:mb-3
      [&_.ql-editor.ql-blank]:before:left-1
      [&_.ql-editor.ql-blank]:before:content-[attr(data-placeholder)]
      [&_.ql-editor.ql-blank]:before:not-italic
      [&_.ql-editor.ql-blank]:before:text-zinc-600
      [&_.ql-editor_h1]:!my-4
      [&_.ql-editor_h1]:font-bold
      [&_.ql-editor_h2]:!my-3
      [&_.ql-editor_h2]:font-bold
      [&_.ql-editor_h3]:!my-3
      [&_.ql-editor_h3]:font-bold
      [&_.ql-editor_h4]:!my-3
      [&_.ql-editor_h4]:font-bold
      [&_.ql-editor_h5]:!my-3
      [&_.ql-editor_h5]:font-bold
`;

const readOnlyStyle = `
      [&_.ql-editor]:!h-auto
      [&_.ql-editor]:!min-h-0
      [&_.ql-editor]:!pt-0
      [&_.ql-editor]:!border-0
      [&_.ql-container]:!border-0
`;

const baseToolbar = [
  [
    [{ font: [] }],
    { size: ['ft14', 'ft10', 'ft12', 'ft15', 'ft16', 'ft18', 'ft20'] },
    { header: [1, 2, 3, 4, 5, false] },
    'bold',
    'italic',
    'underline',
    { color: [] },
    { background: [] },
    { indent: '-1' },
    { indent: '+1' },
    { align: [] },
    { list: 'ordered' },
    { list: 'bullet' },
    { script: 'sub' },
    { script: 'super' },
    'link',
    'image',
  ],
];

const simpleBar = [['bold', 'italic', 'underline', { color: [] }, { background: [] }, { indent: '-1' }]];

export default (props: PropsType) => {
  const editorRef = useRef<any>(null);
  const quillRef = useRef<any>(null);

  const initEditor = () => {
    let toolbar = baseToolbar;
    if (props.isSimple && props.theme === 'snow') {
      toolbar = simpleBar;
    }
    const options: QuillOptions = {
      readOnly: props.readOnly,
      modules: {
        toolbar: props.readOnly ? null : toolbar,
      },
      placeholder: props.placeholder || '请输入正文',
      theme: props.theme || 'bubble',
    };

    quillRef.current = new Quill(editorRef.current, options);

    const FontSize: any = Quill.import('attributors/class/size');
    FontSize.whitelist = ['ft10', 'ft12', 'ft14', 'ft16', 'ft18', 'ft20'];
    Quill.register(FontSize, true);

    quillRef.current.on('text-change', () => props.onChange?.(quillRef.current.getSemanticHTML()));
    const htmlContent = props.html.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    quillRef.current.clipboard.dangerouslyPasteHTML(htmlContent);
  };

  useEffect(initEditor, [props.readOnly]);

  /**
   *  内容反差色调整，snow 模式下在深背景下，字体自动变亮
   *  contrastColor: 反差色
   * */
  const colorLuma = props.luma || 1;
  const isHighlight = props.theme === 'snow' && colorLuma < 0.3;

  return (
    <div
      style={{ color: props.contrastColor }}
      className={`quill-editor relative ${contentStyle}
        ${props.className}
        ${isHighlight ? '[&_.ql-stroke]:stroke-zinc-200/50' : ''}
        ${props.readOnly ? readOnlyStyle : '[&_.ql-editor]:min-h-[200px]'}`}
    >
      <div className={'relative break-words text-zinc-800'} ref={editorRef} />
    </div>
  );
};
