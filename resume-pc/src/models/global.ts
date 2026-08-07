import Api from '@/api';
import { getVipInfo } from '@/api/Vip';
import { LOCALHOST_ENUMS } from '@/constants/enums';
import { useModel } from '@umijs/max';
import { configResponsive, useResponsive, useSetState, useUpdateEffect } from 'ahooks';
import { EventSourcePolyfill } from 'event-source-polyfill';

configResponsive({
  small: 640,
  middle: 768,
  large: 1024,
});

type GlobalPropsType = {
  openPayment: boolean;
  openLogin: boolean;
  openUpdatePwd: boolean;
  openSyncEmail: boolean;
  headerNoticeCount: number;
  vipInfo?: API.VipInfoVO;
};

const useGlobal = () => {
  const { setInitialState, initialState } = useModel('@@initialState');
  const responsive = useResponsive();
  const [globalData, setGlobalData] = useSetState<GlobalPropsType>({
    openPayment: false,
    openLogin: false,
    openUpdatePwd: false,
    openSyncEmail: false,
    headerNoticeCount: 0,
  });

  const getMyVipInfo = () => {
    getVipInfo().then((res) => {
      if (res.success) {
        setGlobalData({ vipInfo: res.data });
      }
    });
  };

  const sendAiSseEvent = (
    url: string,
    onMessage: (val: any) => void,
    errorBack?: (e: any) => void,
  ): EventSourcePolyfill => {
    const jwtToken = localStorage.getItem(LOCALHOST_ENUMS.TOKEN);
    const eventSource = new EventSourcePolyfill(`${url}`, {
      headers: {
        [LOCALHOST_ENUMS.TOKEN]: jwtToken as string,
      },
    });
    eventSource.onmessage = onMessage;
    eventSource.onerror = (e: any) => {
      errorBack?.(e);
      eventSource.close();
    };
    return eventSource;
  };

  const refreshUserInfo = () => {
    Api.User.getUserInfo().then((res) => {
      if (res.success) {
        setInitialState(res.data);
      }
    });
  };

  const onUpdateHeadImg = () => {
    setGlobalData({
      headerNoticeCount: globalData.headerNoticeCount + 1,
    });
  };

  useUpdateEffect(() => getMyVipInfo(), [initialState]);

  return {
    getMyVipInfo,
    sendAiSseEvent,
    globalData,
    setGlobalData,
    refreshUserInfo,
    responsive,
    onUpdateHeadImg,
  };
};

export default useGlobal;
