import Loading from '@/components/CommonIcons/Loading';

export default () => {
  return (
    <div className={'flex h-full w-full justify-center p-10'}>
      <div className={'flex items-center space-x-2 text-lg text-zinc-500'}>
        <Loading />
        <span className={'g-line-bg-text'}>loading...</span>
      </div>
    </div>
  );
};
