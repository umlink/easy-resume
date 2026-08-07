import { ResumeDataContext } from '@/context';
import { configItemClass, configItemValClass } from '@/pages/Editor/components/PreviewEditor';
import { Popover } from 'antd-mobile';
import { Action } from 'antd-mobile/es/components/popover';
import { useContext } from 'react';
const contentLineHeight: Action[] = [
  { text: '16px', key: '[&_.ql-editor]:!leading-[16px]' },
  { text: '18px', key: '[&_.ql-editor]:!leading-[18px]' },
  { text: '20px', key: '[&_.ql-editor]:!leading-[20px]' },
  { text: '22px', key: '[&_.ql-editor]:!leading-[22px]' },
  { text: '24px', key: '[&_.ql-editor]:!leading-[24px]' },
  { text: '26px', key: '[&_.ql-editor]:!leading-[26px]' },
  { text: '28px', key: '[&_.ql-editor]:!leading-[28px]' },
  { text: '30px', key: '[&_.ql-editor]:!leading-[30px]' },
];
const lineHeightObj = {};
contentLineHeight.map((item) => (lineHeightObj[item.key] = item.text));
export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  return (
    <div className={configItemClass}>
      <b>内容行高</b>
      <Popover.Menu
        actions={contentLineHeight}
        placement="bottom-start"
        trigger="click"
        onAction={(node) => {
          resumeData.content.config.lineHeight = node.key;
          updateResume(resumeData, true);
        }}
      >
        <span className={configItemValClass}>{lineHeightObj[resumeData.content.config.lineHeight] || '24px'}</span>
      </Popover.Menu>
    </div>
  );
};
