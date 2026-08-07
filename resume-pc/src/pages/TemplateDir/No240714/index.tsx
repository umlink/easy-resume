import { ResumeDataContext } from '@/context';
import LayoutContainer from '@/pages/TemplateDir/components/LayoutContainer';
import CommonSkill from '@/pages/TemplateDir/components/CommonSkill';
import { useContext } from 'react';
import BaseInfo from './components/BaseInfo';
import EntryList from './components/EntryList';

export default () => {
  const { resumeData } = useContext(ResumeDataContext);
  return (
    <LayoutContainer>
      <div className={resumeData.content.config.lineSpace}>
        <BaseInfo />
        <EntryList />
        <CommonSkill />
      </div>
    </LayoutContainer>
  );
};
