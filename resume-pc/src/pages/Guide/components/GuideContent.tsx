import QuillEditor from '@/components/QuillResumeEditor';

export default () => {
  return (
    <div className={'flex-1 rounded-sm bg-white'}>
      <h2>文章标题</h2>
      <QuillEditor html={''} readOnly></QuillEditor>
    </div>
  );
};
