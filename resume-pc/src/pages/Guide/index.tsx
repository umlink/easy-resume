import { Outlet } from '@umijs/max';
import GuideMenus from './components/GuideMenus';

export default () => {
  return (
    <div className={'flex min-h-[calc(100vh-80px)] justify-between'}>
      <GuideMenus />
      <div className={'flex-1 px-2 md:px-5'}>
        <Outlet />
      </div>
    </div>
  );
};
