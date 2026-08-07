import FeatureEntry from '@/pages/Home/components/FeatureEntry';
import Slogan from '@/pages/Home/components/Slogan';
import Footer from '@/pages/Home/components/Footer';
import ShowImgs from '@/pages/Home/components/ShowImgs';

export default () => {
  return (
    <div className={'g-block-bg flex min-h-[calc(100vh-55px)] flex-col'}>
      <div className={'mb-4 flex-1 lg:mb-[60px]'}>
        <Slogan />
        <ShowImgs />
        <FeatureEntry />
      </div>
      <Footer />
    </div>
  );
};
