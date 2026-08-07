import { ResumeDataContext } from '@/context';
import { Dialog } from 'antd-mobile';
import { useContext } from 'react';

type PropsType = {
  pIndex: number;
  index: number;
  children: JSX.Element;
};

export default (props: PropsType) => {
  const { pIndex, index } = props;
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const onDeleteContent = () => {
    Dialog.confirm({
      title: '警告',
      content: '是否删除当前子模块？',
      onConfirm: async () => {
        resumeData.content.entryList[pIndex].contentList.splice(index, 1);
        updateResume(resumeData);
      },
    });
  };
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onDeleteContent();
      }}
    >
      {props.children}
    </div>
  );
};
