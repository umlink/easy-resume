import DivInput from '@/components/DivInput';
import { ResumeDataContext } from '@/context';
import { IContent } from '@/pages/EditorOpt/ResumeInterface';
import { Fragment, useContext } from 'react';
import ContentTitleConfig from '@/pages/TemplateDir/components/ContentTitleConfig';

type PropsType = {
  content: IContent;
  pIndex: number;
  sIndex: number;
  className?: string;
};

export default (props: PropsType) => {
  const { content, pIndex, sIndex } = props;
  const { resumeData, readOnly, updateResume, editContentTitleId } = useContext(ResumeDataContext);
  const hasVal = Boolean(content.title) || Boolean(content.subTitle) || Boolean(content.time);
  return (
    <ContentTitleConfig
      readOnly={readOnly}
      content={content}
      onChange={(ctx) => {
        resumeData.content.entryList[pIndex].contentList[sIndex] = ctx;
        updateResume(resumeData);
      }}
    >
      <div
        className={`flex items-center space-x-[1px] rounded-sm text-[15px] text-zinc-900
        ${editContentTitleId === content.id ? 'outline outline-1 outline-zinc-900' : ''}
        ${props.className}`}
      >
        {(hasVal || !readOnly) && (
          <Fragment>
            {(!!content.title || !readOnly) && (
              <DivInput
                className={`${(content.titleClass || ['flex-1', 'font-bold']).join(' ')} ${
                  readOnly ? 'pr-0' : 'min-w-[100px]'
                }`}
                value={content.title}
                placeholder={'标题 1'}
                onChange={(v) => {
                  resumeData.content.entryList[pIndex].contentList[sIndex].title = v;
                  updateResume(resumeData);
                }}
              />
            )}
            {(!!content.subTitle || !readOnly) && (
              <DivInput
                value={content.subTitle}
                placeholder={'标题 2'}
                className={`${(content.subTitleClass ?? ['flex-none', 'text-center']).join(' ')} ${
                  readOnly ? 'pl-2' : 'min-w-[100px]'
                }`}
                onChange={(v) => {
                  resumeData.content.entryList[pIndex].contentList[sIndex].subTitle = v;
                  updateResume(resumeData);
                }}
              />
            )}
            {(!!content.time || !readOnly) && (
              <DivInput
                value={content.time}
                placeholder={'标题 3'}
                className={`${(content.timeClass || ['flex-1']).join(' ')} text-right`}
                onChange={(v) => {
                  resumeData.content.entryList[pIndex].contentList[sIndex].time = v;
                  updateResume(resumeData);
                }}
              />
            )}
          </Fragment>
        )}
      </div>
    </ContentTitleConfig>
  );
};
