import QuillResumeEditor from '@/components/QuillResumeEditor';
import { ResumeDataContext } from '@/context';
import ContentContainer from '@/pages/TemplateDir/components/ContentContainer';
import EntryContainer from '@/pages/TemplateDir/components/EntryContainer';
import Title from '@/pages/TemplateDir/components/Title';
import { useContext } from 'react';
import BaseInfo from './BaseInfo';
import CommonSkill from '@/pages/TemplateDir/components/CommonSkill';

export default () => {
  const { resumeData, editMode, readOnly, updateResume } = useContext(ResumeDataContext);
  return (
    <div className={'w-[220px] min-w-[220px] space-y-2 pr-4 pt-2'}>
      <BaseInfo />
      {resumeData.content.entryList.slice(0, 2).map((item, pIndex) => {
        return (
          <EntryContainer key={item.id} item={item} index={pIndex}>
            <div className={resumeData.content.config.lineSpace}>
              <Title value={item.title} icon={item.icon} pIndex={pIndex} />
              {item.contentList.map((ct, sIndex) => {
                return (
                  <ContentContainer key={ct.id} pIndex={pIndex} sIndex={sIndex} parent={item}>
                    <QuillResumeEditor
                      isSimple
                      key={editMode + (readOnly ? 'readonly' : 'edit')}
                      theme={editMode}
                      html={ct.content}
                      readOnly={readOnly}
                      onChange={(v) => {
                        resumeData.content.entryList[pIndex].contentList[sIndex].content = v;
                        updateResume(resumeData);
                      }}
                    />
                  </ContentContainer>
                );
              })}
            </div>
          </EntryContainer>
        );
      })}
      <CommonSkill />
    </div>
  );
};
