import '@/assets/less/quill-editor.less';
import { useUpdateEffect } from 'ahooks';
import { notification } from 'antd';
import Quill, { QuillOptions } from 'quill';
import 'quill/dist/quill.bubble.css';
import 'quill/dist/quill.snow.css';
import { useEffect, useRef } from 'react';

export type EditModeType = 'bubble' | 'snow';

type PropsType = {
  html: string;
  readOnly?: boolean;
  isSimple?: boolean;
  placeholder?: string;
  contrastColor?: string;
  theme?: EditModeType;
  className?: string;
  onChange?: (v: string) => void;
  insertLoading?: boolean;
};

const snowStyle: string = `
      [&_.ql-stroke]:!stroke-zinc-500
      [&_.ql-stroke]:!stroke-[1.5]
      [&_.ql-toolbar]:!border-t-0
      [&_.ql-toolbar]:!border-x-0
      [&_.ql-toolbar]:!border-b-zinc-300/50
      [&_.ql-toolbar]:!p-0
`;

const contentStyle = `
      rounded-sm
      text-zinc-800
      [&_.ql-editor]:leading-[28px]
      [&_.ql-container]:h-auto
      [&_.ql-container]:!border-0
      [&_.ql-container]:text-[14px]
      [&_.ql-container]:!whitespace-pre-wrap
      [&_.ql-editor]:p-1
      [&_.ql-editor]:!pt-0
      [&_.ql-editor]:break-all
      [&_.ql-editor_a]:text-[color:#1677ff]
      [&_.ql-editor.ql-blank]:before:left-1
      [&_.ql-editor.ql-blank]:before:content-[attr(data-placeholder)]
      [&_.ql-editor.ql-blank]:before:not-italic
      [&_.ql-editor.ql-blank]:before:text-zinc-400
      [&_.ql-indent-1]:!pl-[28px]
      [&_.ql-tooltip]:z-[1]
`;

const readOnlyStyle = `
      [&_.ql-editor]:!h-auto
      [&_.ql-editor]:!min-h-0
      [&_.ql-editor]:!border-0
      [&_.ql-tooltip]:h-0
      [&_.ql-tooltip]:!hidden
      [&_.ql-editor]:!p-0
`;

const editStyle = `
      outline-1
      outline-dashed
      outline-zinc-400
      pb-7
      [&_.ql-hidden]:h-0
      [&_.ql-editor]:min-h-[80px]
`;

const baseToolbar = [
  [
    { size: ['ft14', 'ft10', 'ft12', 'ft15', 'ft16', 'ft18', 'ft20'] },
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
    'image',
    'link',
  ],
];

const simpleBar = [['bold', 'italic', 'underline', { color: [] }, { background: [] }, { indent: '-1' }]];
export default (props: PropsType) => {
  const quillRef = useRef<any>(null);
  const editorRef = useRef<any>(null);

  const handlerImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 1024 * 1024 * 3) {
        notification.warning({
          message: '提示',
          description: '图片大小不超过3M',
          duration: 1,
        });
        input.value = '';
        return;
      }
      // 上传图片到服务器
      const formData = new FormData();
      formData.append('file', file);
      try {
        // const response = await uploadFile(formData);
        // if (response.success) {
        //   const range = quillRef.current?.getSelection();
        //   quillRef.current?.insertEmbed(range.index, 'image', response.data.url);
        // }
      } catch (error) {
        console.error('图片上传错误:', error);
      }
    };
  };

  const initEditor = () => {
    let toolbar = baseToolbar;
    if (props.isSimple && props.theme === 'snow') {
      toolbar = simpleBar;
    }
    const options: QuillOptions = {
      readOnly: props.readOnly,
      modules: {
        toolbar: props.readOnly
          ? null
          : {
              container: toolbar,
              handlers: {
                image: handlerImage,
              },
            },
      },
      placeholder: props.placeholder || '请输入正文',
      theme: props.theme || 'bubble',
    };

    quillRef.current = new Quill(editorRef.current, options);

    const FontSize: any = Quill.import('attributors/class/size');
    FontSize.whitelist = ['ft10', 'ft12', 'ft14', 'ft16', 'ft18', 'ft20'];
    Quill.register(FontSize, true);

    quillRef.current?.on('text-change', () => {
      if (!props.insertLoading) {
        props.onChange?.(quillRef.current?.getSemanticHTML());
      }
    });
    const htmlContent = props.html.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    quillRef.current?.clipboard.dangerouslyPasteHTML(htmlContent);
  };

  useEffect(initEditor, [props.readOnly]);

  useUpdateEffect(() => {
    if (props.insertLoading) {
      const htmlContent = props.html.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
      quillRef.current?.clipboard.dangerouslyPasteHTML(htmlContent);
    }
  }, [props.html]);

  return (
    <div
      style={{ color: props.contrastColor }}
      className={`quill-editor relative ${contentStyle}
        ${props.className}
        ${props.theme === 'snow' ? snowStyle : ''}
        ${props.readOnly ? readOnlyStyle : editStyle}`}
    >
      <div className={`break-words [&_.ql-editor]:overflow-visible`} ref={editorRef} />
    </div>
  );
};
