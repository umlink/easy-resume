import { ResumeDataContext } from '@/context';
import LayoutContainer from '@/pages/TemplateDir/components/LayoutContainer';
import { useContext } from 'react';
import EntryList from './components/EntryList';
import Header from './components/Header';
import CommonSkill from '@/pages/TemplateDir/components/CommonSkill';

const ResumeTemplate = () => {
  const { resumeData } = useContext(ResumeDataContext);
  return (
    <LayoutContainer>
      <div className={resumeData.content.config.lineSpace}>
        <Header />
        <EntryList />
        <CommonSkill />
      </div>
    </LayoutContainer>
  );
};

export default ResumeTemplate;
