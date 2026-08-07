import { getHexColorByAlpha, isMobile } from '@/utils/tools';
import { Press } from '@icon-park/react';
import { useAccess, useModel } from '@umijs/max';
import { Image, Spin, message } from 'antd';

export default (props: { item: API.TemplateItemVO }) => {
  const access = useAccess();
  const { genResumeByCode, homeState } = useModel('Template.model');
  const { setGlobalData } = useModel('global');
  const onCreate = () => {
    if (isMobile()) {
      message.warning('移动端编辑功能开发中，敬请期待～');
      return;
    }
    if (homeState.genCode === props.item.code) return;
    if (!access.isLogin) {
      setGlobalData({ openLogin: true });
      return;
    }
    genResumeByCode(props.item.code);
  };
  return (
    <div
      className={`group
        relative flex aspect-[2/3]
        overflow-hidden rounded-xl
        border
        border-zinc-200
        hover:drop-shadow-lg`}
      style={{ borderColor: getHexColorByAlpha(props.item.content.config.themeColor, 0.2) }}
    >
      <Spin spinning={homeState.genCode === props.item.code}>
        <Image placeholder className={'rounded-sm'} preview={false} src={props.item.headerImg} />
      </Spin>
      <div
        className={`absolute bottom-0 left-0 right-0 flex h-[32px]
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
        <div className={'hidden w-full text-center group-hover:block'} onClick={onCreate}>
          <b className={'g-line-bg-text'}>制作简历</b>
        </div>
      </div>
      <span
        className={`g-line-bg-text absolute right-0 top-0 rounded-bl
          rounded-tr bg-white/5 px-2 py-1 text-[12px]
          font-light shadow backdrop-blur-sm`}
      >
        {props.item.code}
      </span>
    </div>
  );
};
