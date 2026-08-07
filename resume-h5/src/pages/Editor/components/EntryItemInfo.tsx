import { ResumeDataContext } from '@/context';
import { IContent } from '@/interface/resume';
import QuillEditor from '@/pages/components/QuillEditor';
import { useContext } from 'react';

type IPropsType = {
  entryInfo: IContent;
  pIndex: number;
  index: number;
};

export default (props: IPropsType) => {
  const { entryInfo, pIndex, index } = props;
  const hasSubInfo = !!entryInfo.subTitle || !!entryInfo.time;
  const { resumeData } = useContext(ResumeDataContext);

  return (
    <div className={'bg-zinc-50 p-1 rounded'}>
      <div className={'mb-2 space-y-2'}>
        <div className={'flex-center-between text-[16px]'}>
          <b>{entryInfo.title || ''}</b>
        </div>
        {hasSubInfo && (
          <div className={'flex-center-between text-zinc-600'}>
            {!!entryInfo.subTitle && <span>{entryInfo.subTitle}</span>}
            {!!entryInfo.time && <span>{entryInfo.time}</span>}
          </div>
        )}
      </div>
      <div className={'space-y-2'}>
        <QuillEditor readOnly={true} key={resumeData.updatedAt + entryInfo.id} html={entryInfo.content} />
      </div>
    </div>
  );
};
