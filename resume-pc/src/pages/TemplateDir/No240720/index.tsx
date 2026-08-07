import LayoutContainer from '@/pages/TemplateDir/components/LayoutContainer';
import EntryList from './components/EntryList';
import Header from './components/Header';
import Introduce from './components/Introduce';

const ResumeTemplate = () => {
  return (
    <LayoutContainer>
      <div className={'flex min-h-screen flex-col'}>
        <Header />
        <div className={'flex flex-1 justify-between px-2'}>
          <Introduce />
          <div className={'flex-1 border-l border-l-zinc-400 py-2 pl-4'}>
            <EntryList />
          </div>
        </div>
      </div>
    </LayoutContainer>
  );
};

export default ResumeTemplate;
