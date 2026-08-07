import QuillResumeEditor from '@/components/QuillResumeEditor';
import { ResumeDataContext } from '@/context';
import ContentContainer from '@/pages/TemplateDir/components/ContentContainer';
import BlockContainer from '@/pages/TemplateDir/components/EntryContainer';
import CommonSkill from '@/pages/TemplateDir/components/CommonSkill';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';
import Title from '@/pages/TemplateDir/components/Title';
import { useContext } from 'react';
import BaseInfo from './BaseInfo';

export default () => {
  const { resumeData, editMode, readOnly, luma, contrastColor, updateResume } = useContext(ResumeDataContext);
  return (
    <div
      className={`w-[220px] min-w-[220px] p-4 ${resumeData.content.config.lineSpace}`}
      style={{ backgroundColor: resumeData.content.config.themeColor }}
    >
      <div className={`relative flex flex-col justify-center py-4`}>
        <div className={'mb-5'}>
          <HeaderPhoto imgClass={'border-[3px] border border-white'} size={120} round />
        </div>
        <div className={resumeData.content.config.lineSpace}>
          <BaseInfo />
          {resumeData.content.entryList.slice(0, 2).map((item, pIndex) => {
            return (
              <BlockContainer key={item.id} item={item} index={pIndex}>
                <div className={resumeData.content.config.lineSpace}>
                  <Title
                    themeColor={contrastColor}
                    containerClass={'!border-b-0'}
                    pIndex={pIndex}
                    icon={item.icon}
                    value={item.title}
                  />
                  {item.contentList.map((ct, sIndex) => {
                    return (
                      <ContentContainer key={ct.id} pIndex={pIndex} sIndex={sIndex} parent={item}>
                        <div className={resumeData.content.config.lineSpace}>
                          <QuillResumeEditor
                            isSimple
                            key={editMode + (readOnly ? 'readonly' : 'edit')}
                            luma={luma}
                            theme={editMode}
                            html={ct.content}
                            readOnly={readOnly}
                            contrastColor={contrastColor}
                            onChange={(v) => {
                              resumeData.content.entryList[pIndex].contentList[sIndex].content = v;
                              updateResume(resumeData);
                            }}
                          />
                        </div>
                      </ContentContainer>
                    );
                  })}
                </div>
              </BlockContainer>
            );
          })}
          <CommonSkill color={contrastColor} />
        </div>
      </div>
    </div>
  );
};
