import { PROJECT_TITLE, subThemeColor } from '@/constants';
import { Link } from '@umijs/max';
import { Button, ConfigProvider } from 'antd';

export default () => {
  return (
    <div className={'w-full font-mono'}>
      <div
        className={`mx-auto flex w-full max-w-[1110px] items-center
          justify-between px-4 py-[40px] md:py-[80px] lg:pr-20`}
      >
        <div className={'font-mono'}>
          <h1 className={'text-center text-[45px] font-extrabold subpixel-antialiased md:text-left md:text-[65px]'}>
            {PROJECT_TITLE}
          </h1>
          <p className={'mt-6 text-[20px] !leading-10 md:text-[28px] '}>
            致力于为应届生和社招求职者提供轻量、极简
            <br className={'hidden md:inline-block'} />
            和易操作的在线 <b className={'text-primary'}>AI智能</b> 简历制作工具
          </p>
          <p className={'g-line-bg-text mt-6 text-[16px]'}>“生活不可能像你想象得那么好，但也不会像你想象得那么糟”</p>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: subThemeColor,
              },
            }}
          >
            <div className={'mt-12 space-x-4 text-center md:text-left'}>
              <Link to={'/template'} prefetch>
                <Button size={'large'} type={'primary'} shape={'round'}>
                  立即制作简历
                </Button>
              </Link>
              <Link to={'/guide/592839983095877'} prefetch>
                <Button size={'large'} type={'primary'} shape={'round'} ghost>
                  <span className={'g-line-bg-text'}> 如何写好简历？</span>
                </Button>
              </Link>
            </div>
          </ConfigProvider>
        </div>
        <div className={'relative hidden lg:inline-block'}>
          <div className={'g-gradation-bg h-[250px] w-[250px]'}></div>
          <img
            className={'w-[200px] rounded-full'}
            src="https://static.wktline.com/avatar/0f005101834c3f32911eda7e501cc174.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
