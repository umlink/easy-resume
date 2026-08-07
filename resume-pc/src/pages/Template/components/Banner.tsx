import BannerImg from '@/assets/home/banner.png';
import { Image } from 'antd';

export default () => {
  return (
    <div className={'w-full leading-none'}>
      <Image className={'rounded-sm'} src={BannerImg} preview={false} />
    </div>
  );
};
