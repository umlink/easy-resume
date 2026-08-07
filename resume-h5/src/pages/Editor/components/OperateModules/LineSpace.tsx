import { ResumeDataContext } from '@/context';
import { configItemClass, configItemValClass } from '@/pages/Editor/components/PreviewEditor';
import { Popover } from 'antd-mobile';
import { Action } from 'antd-mobile/es/components/popover';
import { useContext } from 'react';

const lineSpaceActions: Action[] = [
  { text: '0px', key: 'space-y-[1px]' },
  { text: '2px', key: 'space-y-[2px]' },
  { text: '4px', key: 'space-y-1' },
  { text: '6px', key: 'space-y-[6px]' },
  { text: '8px', key: 'space-y-2' },
  { text: '10px', key: 'space-y-[10px]' },
  { text: '12px', key: 'space-y-3' },
];

const lineSpaceObj = {};
lineSpaceActions.map((item) => (lineSpaceObj[item.key] = item.text));

export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  return (
    <div className={configItemClass}>
      <b>模块间距</b>
      <Popover.Menu
        actions={lineSpaceActions}
        placement="bottom-start"
        trigger="click"
        onAction={(node) => {
          resumeData.content.config.lineSpace = node.key;
          updateResume(resumeData, true);
        }}
      >
        <span className={configItemValClass}>{lineSpaceObj[resumeData.content.config.lineSpace]}</span>
      </Popover.Menu>
    </div>
  );
};
