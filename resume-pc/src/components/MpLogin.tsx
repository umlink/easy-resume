import { getQrCode, loopLoginStatus } from '@/api/Auth';
import { LOCALHOST_ENUMS } from '@/constants/enums';
import useQueryParams from '@/hooks/useQueryParams';
import { useModel, NavLink, useRequest } from '@umijs/max';
import { useSetState } from 'ahooks';
import { Modal, notification, Spin } from 'antd';
import React, { useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';

type StateType = {
  qrcode: string;
};
const LoginContainer = () => {
  const [notificationInstance, contextHolder] = notification.useNotification();
  const [query] = useQueryParams();
  const [state, setState] = useSetState<StateType>({
    qrcode: '',
  });
  const { globalData, setGlobalData, refreshUserInfo } = useModel('global');

  const loginSuccessTips = () => {
    notificationInstance.success({
      message: '登录成功',
      duration: 8,
      description: (
        <div className={'space-y-3'}>
          <p>
            <b>温馨提示</b>：新用户登录后 <span className={'font-bold'}>可免费体验一天会员</span>
            ，所有功能不受限，体验到期后需要付费使用，具体费用可查看 <NavLink to="/vip">「权益中心」</NavLink>。
          </p>
          <p className={'text-[color:#faad14]'}>
            简历如着装，第一印象很重要，轻简历给您清爽编辑体验和精简的模板，您可满意后再付费。
          </p>
        </div>
      ),
    });
  };

  const loopLoginRet = useMemoizedFn((verifyCode: number) => {
    if (!state.qrcode) return;
    loopLoginStatus({ verifyCode: String(verifyCode) }).then((res) => {
      if (res.success && res.data) {
        localStorage.setItem(LOCALHOST_ENUMS.TOKEN, res.data);
        setGlobalData({ openLogin: false });
        refreshUserInfo();
        loginSuccessTips();
      } else {
        setTimeout(() => loopLoginRet(verifyCode), 1500);
      }
    });
  });

  const onClose = () => {
    setGlobalData({ openLogin: false });
    setState({ qrcode: '' });
  };

  const { loading, run: getQrcodeUrl } = useRequest(
    () =>
      getQrCode({ inviteCode: query.inviteCode }).then((res) => {
        setState({ qrcode: res.data.imgUrl });
        setTimeout(() => loopLoginRet(res.data.verifyCode), 3000);
      }),
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (globalData.openLogin) {
      getQrcodeUrl();
    }
  }, [globalData.openLogin]);

  return (
    <>
      {contextHolder}
      <Modal
        title={'微信扫码登录'}
        style={{ padding: 0 }}
        width={348}
        open={globalData.openLogin}
        footer={null}
        maskClosable={false}
        onCancel={onClose}
      >
        <div className={'py-5'}>
          <Spin spinning={loading}>
            <img className={'mx-auto h-[250px] w-[250]'} src={state.qrcode} alt="" />
          </Spin>
        </div>
      </Modal>
    </>
  );
};

export default LoginContainer;
