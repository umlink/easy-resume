import LayoutContainer from '@/pages/TemplateDir/components/LayoutContainer';
import EntryList from './components/EntryList';
import Left from './components/Left';
import TopInfo from './components/TopInfo';

export default () => {
  return (
    <LayoutContainer>
      <div className={'flex min-h-screen justify-between'}>
        <Left />
        <div className={'flex-1 p-4'}>
          <TopInfo />
          <EntryList />
        </div>
      </div>
    </LayoutContainer>
  );
};
