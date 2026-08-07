import MpLogin from '@/components/MpLogin';
import PaymentLove from '@/components/PaymentLove';
import EmailSyncData from '@/components/EmailSyncData';
import ResetPassword from '@/components/ResetPassword';
import { themeColor } from '@/constants';
import { StyleProvider } from '@ant-design/cssinjs';
import '@icon-park/react/styles/index.css';
import { Outlet, useLocation } from '@umijs/max';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect } from 'react';

const Layouts = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          fontSize: 14,
          colorPrimary: themeColor,
          borderRadius: 12,
          borderRadiusSM: 12,
          borderRadiusLG: 12,
          borderRadiusXS: 10,
        },
      }}
    >
      <StyleProvider hashPriority="high">
        <Outlet />
        <MpLogin />
        <ResetPassword />
        <PaymentLove />
        <EmailSyncData />
      </StyleProvider>
    </ConfigProvider>
  );
};

export default Layouts;
