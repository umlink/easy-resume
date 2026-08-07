import { copyResume, getResumeInfo } from '@/api/Resume';
import { LOCALHOST_ENUMS } from '@/constants/enums';
import { ResumeDataContext } from '@/context';
import { IResumeData } from '@/interface/resume';
import { CopyOne } from '@icon-park/react';
import { Dialog, Toast } from 'antd-mobile';
import { useContext } from 'react';

export default () => {
  const { updateResume, resumeData } = useContext(ResumeDataContext);

  const onCopyResume = () => {
    copyResume({ id: +resumeData.id }).then((res) => {
      if (res.success) {
        getResumeInfo({ id: res.data }).then((res) => {
          if (res.success) {
            const data = {
              ...res.data,
              ...(res.data.content as any),
            } as IResumeData;
            updateResume(data);
            Toast.show('复制成功');
            location.replace(
              `${location.origin}?resumeId=${data.id}&token=${localStorage.getItem(LOCALHOST_ENUMS.TOKEN)}`,
            );
          } else {
            Toast.show({
              icon: 'fail',
              content: res.message,
            });
          }
        });
      }
    });
  };

  const onCopyConfirm = () => {
    Dialog.confirm({
      title: '温馨提示',
      content: '从当前简历复制出一个副本简历？',
      onConfirm: onCopyResume,
    });
  };
  return (
    <span className={'action-span-btn'} onClick={onCopyConfirm}>
      <CopyOne theme="outline" size="24" />
    </span>
  );
};
