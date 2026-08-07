import { EditModeType } from '@/components/QuillEditor';
import { ResumeDataContext } from '@/context';
import { SoapBubble, TopBar } from '@icon-park/react';
import { Segmented } from 'antd';
import { useContext } from 'react';

export default () => {
  const { editMode, updateEditMode, readOnly } = useContext(ResumeDataContext);
  if (readOnly) return null;
  return (
    <div className={'flex w-full items-center justify-between py-3'}>
      <span className={'g-line-before-title'}>编辑模式</span>
      <Segmented
        size={'small'}
        value={editMode}
        options={[
          { label: '常规', value: 'snow', icon: <TopBar /> },
          { label: '精简', value: 'bubble', icon: <SoapBubble /> },
        ]}
        onChange={(value: EditModeType) => {
          updateEditMode?.(value);
        }}
      />
    </div>
  );
};
