import { ResumeDataContext } from '@/context';
import { Press } from '@icon-park/react';
import { Image } from 'antd';
import { useContext } from 'react';

export default (props: { item: API.TemplateItemVO; onClose: () => void }) => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);

  const onSelectTemplate = () => {
    resumeData.templateCode = props.item.code;
    resumeData.content.config = props.item.content.config;
    resumeData.content.avatar = props.item.content.avatar;
    resumeData.content.margin = props.item.content.margin;
    updateResume(resumeData);
    props.onClose();
  };

  return (
    <div
      className={`border-1
        group relative
        flex
        aspect-[2/3] overflow-hidden
        rounded-sm border
        border-zinc-200
        hover:border-primary
        hover:shadow-lg`}
    >
      <Image placeholder className={'rounded'} preview={false} src={props.item.headerImg} />
      <div
        className={`absolute bottom-0 left-0 right-0 flex h-[40px]
          cursor-pointer items-center justify-between rounded-b
          bg-zinc-100/90 px-3 text-[14px] text-zinc-700
          shadow-inner`}
      >
        <div className={'flex w-full items-center justify-between space-x-2 group-hover:hidden'}>
          <span>{props.item.tags.join('、')}</span>
          <span className={'space-x-1'}>
            <span>
              <Press theme="outline" fill={'#999'} size={16} />
            </span>
            <span>{props.item.useCount}</span>
          </span>
        </div>
        <div className={'hidden w-full text-center group-hover:block'} onClick={onSelectTemplate}>
          <span className={'g-line-bg-text'}>应用模板</span>
        </div>
      </div>
      <span
        className={`g-line-bg-text absolute right-0 top-0 rounded-bl rounded-tr
          bg-white/5 px-2 py-1 text-[12px] font-light
          shadow backdrop-blur-sm`}
      >
        {props.item.code}
      </span>
    </div>
  );
};
