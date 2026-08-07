import { ResumeDataContext } from '@/context';
import AiOperateBlock from '@/pages/Editor/components/AiOperateBlock';
import CopyResume from '@/pages/Editor/components/CopyResume';
import DeleteResume from '@/pages/Editor/components/DeleteResume';
import ExportPdf from '@/pages/Editor/components/ExportPdf';
import Preview from '@/pages/Editor/components/Preview';
import PreviewEditor from '@/pages/Editor/components/PreviewEditor';
import ThemeList from '@/pages/Editor/components/ThemeList';
import { PreviewOpen, SettingConfig, Theme } from '@icon-park/react';
import { useContext } from 'react';

export default () => {
  const { resumeData } = useContext(ResumeDataContext);
  return (
    <div className={'fixed flex items-center justify-center space-x-3 inset-x-0 bottom-0 p-4 pb-5 bg-white/60'}>
      <DeleteResume />
      <CopyResume />
      <PreviewEditor>
        <span className={'action-span-btn'}>
          <SettingConfig theme="outline" size="24" />
        </span>
      </PreviewEditor>
      <ThemeList>
        <span className={'action-span-btn'} style={{ color: resumeData.content.config.themeColor }}>
          <Theme theme="outline" size="24" />
        </span>
      </ThemeList>
      <AiOperateBlock />
      <Preview>
        <span className={'action-span-btn'}>
          <PreviewOpen theme="outline" size="24" />
        </span>
      </Preview>
      <ExportPdf />
    </div>
  );
};
