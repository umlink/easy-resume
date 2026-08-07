import { copyResume, getResumeInfo } from '@/api/Resume';
import { ResumeDataContext } from '@/context';
import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';
import { CopyOne } from '@icon-park/react';
import { Button, message, Modal, Tooltip } from 'antd';
import React, { useContext } from 'react';

export default () => {
  const [modal, contextHolder] = Modal.useModal();
  const { resumeData } = useContext(ResumeDataContext);

  const onCopyResume = () => {
    copyResume({ id: +resumeData.id }).then((res) => {
      if (res.success) {
        getResumeInfo({ id: res.data }).then((res) => {
          if (res.success) {
            const data = {
              ...res.data,
              ...(res.data.content as any),
            } as IResumeData;
            message.success('副本创建成功');
            setTimeout(() => location.replace(`/editor/${data.id}`), 1000);
          }
        });
      }
    });
  };

  const onCopyConfirm = () => {
    modal.confirm({
      title: '复制确认',
      autoFocusButton: undefined,
      content: '确认从该简历复制出一个副本？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => onCopyResume(),
    });
  };
  return (
    <>
      <Tooltip title="制作副本" placement={'top'}>
        <Button
          onClick={onCopyConfirm}
          icon={
            <span className={'flex'}>
              <CopyOne size={20} />
            </span>
          }
        />
      </Tooltip>
      {contextHolder}
    </>
  );
};
