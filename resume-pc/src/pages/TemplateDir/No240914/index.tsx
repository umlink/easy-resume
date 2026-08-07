import LayoutContainer from '@/pages/TemplateDir/components/LayoutContainer';
import BaseInfo from './components/BaseInfo';
import EntryList from './components/EntryList';

export default () => {
  return (
    <LayoutContainer>
      <div>
        <BaseInfo />
        <EntryList />
      </div>
    </LayoutContainer>
  );
};
