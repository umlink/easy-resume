import { ResumeDataContext } from '@/context';
import { configItemClass } from '@/pages/Editor/components/PreviewEditor';
import { PreviewCloseOne, PreviewOpen } from '@icon-park/react';
import { Radio } from 'antd-mobile';
import { useContext } from 'react';
export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  return (
    <div className={`${configItemClass}`}>
      <b className={'whitespace-nowrap'}>{resumeData.content.skill.title}</b>
      <div className={'flex items-center space-x-2 text-[14px]'}>
        <Radio.Group
          value={resumeData.content.skill.type}
          onChange={(type) => {
            resumeData.content.skill.type = type as string;
            updateResume(resumeData);
          }}
        >
          <span className={'flex space-x-2'}>
            <Radio value="step">进度条</Radio>
            <Radio value="dashboard">进度圈</Radio>
          </span>
        </Radio.Group>
        <span
          className={'flex p-1 rounded-full bg-zinc-100 border text-zinc-900 border-zinc-100'}
          onClick={() => {
            resumeData.content.skill.show = !resumeData.content.skill.show;
            updateResume(resumeData, true);
          }}
        >
          {resumeData.content.skill.show ? (
            <PreviewOpen theme="outline" size="22" />
          ) : (
            <PreviewCloseOne theme="outline" size="22" />
          )}
        </span>
      </div>
    </div>
  );
};
