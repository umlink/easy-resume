import FloatTools from '@/components/FloatTools';
import '@icon-park/react/styles/index.css';
import { Outlet, useLocation } from '@umijs/max';
import Header from './components/Header';

const Layouts = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <>
      <Header />
      <div className={`mx-auto ${isHome ? '' : 'mt-3 max-w-[1110px] px-3 md:mt-5 md:px-4'} text-[14px]`}>
        <Outlet />
      </div>
      <FloatTools />
    </>
  );
};

export default Layouts;
