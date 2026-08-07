import { ResumeDataContext } from '@/context';
import LayoutContainer from '@/pages/TemplateDir/components/LayoutContainer';
import { useContext } from 'react';
import BaseInfo from './components/BaseInfo';
import EntryList from './components/EntryList';
import CommonSkill from '@/pages/TemplateDir/components/CommonSkill';

export default () => {
  const { resumeData } = useContext(ResumeDataContext);
  return (
    <LayoutContainer>
      <div className={resumeData.content.config.lineSpace}>
        <BaseInfo />
        <EntryList />
        {resumeData.content.skill?.show && (
          <div className={'px-8'}>
            <CommonSkill />
          </div>
        )}
      </div>
    </LayoutContainer>
  );
};
