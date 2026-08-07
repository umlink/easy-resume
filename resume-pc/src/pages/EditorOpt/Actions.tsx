import { ResumeDataContext } from '@/context';
import { Affix } from 'antd';
import EditPreview from './components/EditPreview';
import EntryTitle from './components/EntryTitle';
import LineSpace from './components/LineSpace';
import Margin from './components/Margin';
import Setting from './components/Setting';
import Template from './components/Template';
import ThemeColor from './components/ThemeColor';
import HeaderPhoto from './components/HeaderPhoto';
import ContentLineHeight from './components/ContentLineHeight';
import { useContext } from 'react';
import Skill from './components/Skill';

export default () => {
  const { resumeData } = useContext(ResumeDataContext);
  if (!resumeData.id) return null;
  return (
    <Affix offsetTop={71}>
      <div
        key={resumeData.id}
        className={`
        no-scrollbar relative h-[calc(100vh-87px)] w-[260px]
        divide-y divide-solid divide-zinc-200/70
        overflow-y-auto rounded-xl bg-white px-4 shadow`}
      >
        <EditPreview />
        <Template />
        <LineSpace />
        <ContentLineHeight />
        <ThemeColor />
        <HeaderPhoto />
        <Margin />
        <EntryTitle />
        <Skill />
        <Setting />
      </div>
    </Affix>
  );
};
