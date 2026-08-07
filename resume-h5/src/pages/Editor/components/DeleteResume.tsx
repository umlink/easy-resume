import { removeResume } from '@/api/Resume';
import { ResumeDataContext } from '@/context';
import { Delete } from '@icon-park/react';
import { Dialog, Toast } from 'antd-mobile';
import { useContext } from 'react';

export default () => {
  const { resumeData } = useContext(ResumeDataContext);
  const onDelResume = () => {
    removeResume({ id: resumeData.id }).then((res) => {
      if (res.success) {
        Toast.show('删除成功');
        window.wx?.miniProgram.navigateBack({ delta: 1 });
      }
    });
  };

  const deleteConfirm = () => {
    Dialog.confirm({
      title: '警告',
      content: '简历删除后不可恢复！',
      onConfirm: () => onDelResume(),
    });
  };

  return (
    <span className={'action-span-btn'} onClick={deleteConfirm}>
      <Delete theme="outline" size="24" fill="#f74946" />
    </span>
  );
};
