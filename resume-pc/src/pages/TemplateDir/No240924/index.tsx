import LayoutContainer from '@/pages/TemplateDir/components/LayoutContainer';
import EntryList from './components/EntryList';
import Header from './components/Header';
import Introduce from './components/Introduce';

const ResumeTemplate = () => {
  return (
    <LayoutContainer>
      <div className={'flex min-h-screen flex-col'}>
        <Header />
        <div className={'flex flex-1 justify-between space-x-5'}>
          <Introduce />
          <div className={'flex-1 py-4'}>
            <EntryList />
          </div>
        </div>
      </div>
    </LayoutContainer>
  );
};

export default ResumeTemplate;
