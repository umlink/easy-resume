export default () => {
  return (
    <div className={'w-full border-t border-t-zinc-300 bg-zinc-800'}>
      <div className={'mx-auto max-w-[1110px] space-y-2 px-3 py-4 pb-20 text-zinc-400 lg:px-0'}>
        <div className={'font-light'}>
          <span>备案号：</span>
          <a
            className={'g-line-bg-text'}
            href={'https://beian.miit.gov.cn/#/Integrated/index'}
            target={'_blank'}
            rel="noreferrer"
          >
            浙ICP备2022020603号
          </a>
        </div>
      </div>
    </div>
  );
};
