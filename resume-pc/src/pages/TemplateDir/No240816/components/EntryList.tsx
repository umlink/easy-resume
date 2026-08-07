import QuillResumeEditor from '@/components/QuillResumeEditor';
import { ResumeDataContext } from '@/context';
import ContentContainer from '@/pages/TemplateDir/components/ContentContainer';
import ContentTitle from '@/pages/TemplateDir/components/ContentTitle';
import BlockContainer from '@/pages/TemplateDir/components/EntryContainer';
import Title from '@/pages/TemplateDir/components/Title';
import { useContext } from 'react';

export default () => {
  const { resumeData, editMode, readOnly, updateResume } = useContext(ResumeDataContext);

  return (
    <div className={resumeData.content.config.lineSpace}>
      {resumeData.content.entryList.slice(2).map((item, index) => {
        const pIndex = index + 2;
        return (
          <BlockContainer key={item.id} item={item} index={pIndex}>
            <div className={`${resumeData.content.config.lineSpace}`}>
              <Title value={item.title} icon={item.icon} pIndex={pIndex} />
              {item.contentList.map((ct, sIndex) => {
                return (
                  <ContentContainer key={ct.id} pIndex={pIndex} sIndex={sIndex} parent={item}>
                    <div className={resumeData.content.config.lineSpace}>
                      <ContentTitle className={'!text-zinc-800'} content={ct} pIndex={pIndex} sIndex={sIndex} />
                      {(ct.content !== '<p></p>' || !readOnly) && (
                        <QuillResumeEditor
                          key={editMode + (readOnly ? 'readonly' : 'edit')}
                          html={ct.content}
                          readOnly={readOnly}
                          theme={editMode}
                          onChange={(v) => {
                            resumeData.content.entryList[pIndex].contentList[sIndex].content = v;
                            updateResume(resumeData);
                          }}
                        />
                      )}
                    </div>
                  </ContentContainer>
                );
              })}
            </div>
          </BlockContainer>
        );
      })}
    </div>
  );
};
