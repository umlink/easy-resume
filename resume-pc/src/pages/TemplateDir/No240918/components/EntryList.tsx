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
      {resumeData.content.entryList.map((item, pIndex) => {
        return (
          <BlockContainer key={item.id} item={item} index={pIndex}>
            <div className={resumeData.content.config.lineSpace}>
              <Title value={item.title} icon={item.icon} pIndex={pIndex} />
              {item.contentList.map((ct, sIndex) => {
                return (
                  <ContentContainer key={ct.id + pIndex} pIndex={pIndex} sIndex={sIndex} parent={item}>
                    <div className={`leading-1 ${resumeData.content.config.lineSpace}`}>
                      <ContentTitle content={ct} pIndex={pIndex} sIndex={sIndex} />
                      {(ct.content !== '<p></p>' || !readOnly) && (
                        <QuillResumeEditor
                          className={'[&_.ql-editor]:leading-[22px]'}
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
