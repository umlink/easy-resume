import QuillResumeEditor from '@/components/QuillResumeEditor';
import { ResumeDataContext } from '@/context';
import CommonSkill from '@/pages/TemplateDir/components/CommonSkill';
import ContentContainer from '@/pages/TemplateDir/components/ContentContainer';
import ContentTitle from '@/pages/TemplateDir/components/ContentTitle';
import BlockContainer from '@/pages/TemplateDir/components/EntryContainer';
import Title from '@/pages/TemplateDir/components/Title';
import { getHexColorByAlpha } from '@/utils/tools';
import { useContext } from 'react';

export default () => {
  const { resumeData, editMode, readOnly, updateResume } = useContext(ResumeDataContext);
  const borderColor = getHexColorByAlpha(resumeData.content.config.themeColor, 0.2);
  return (
    <div
      className={`${resumeData.content.config.lineSpace} rounded-b !border-t-0 p-3 px-4`}
      style={{ border: `1px solid ${borderColor}` }}
    >
      {resumeData.content.entryList.map((item, pIndex) => {
        return (
          <BlockContainer key={item.id} item={item} index={pIndex}>
            <div className={resumeData.content.config.lineSpace}>
              <Title value={item.title} icon={item.icon} pIndex={pIndex} />
              {item.contentList.map((ct, sIndex) => {
                return (
                  <ContentContainer key={ct.id} pIndex={pIndex} sIndex={sIndex} parent={item}>
                    <div className={'space-y-[1px]'}>
                      <ContentTitle content={ct} pIndex={pIndex} sIndex={sIndex} />
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
      <CommonSkill />
    </div>
  );
};
