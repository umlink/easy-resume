import { Like } from '@icon-park/react';
import { useModel } from '@umijs/max';
import { Image, Modal } from 'antd';
import React from 'react';

const PaymentLove = () => {
  const { globalData, setGlobalData } = useModel('global');

  return (
    <Modal
      title={
        <span className={'flex items-center space-x-1'}>
          <Like theme="outline" size={20} fill="#eb1a1d" />
          <span>为爱发电</span>
          <Like theme="outline" size={20} fill="#eb1a1d" />
        </span>
      }
      styles={{ header: { padding: 0 } }}
      style={{ padding: 0 }}
      width={480}
      open={globalData.openPayment}
      footer={null}
      onCancel={() => setGlobalData({ openPayment: false })}
    >
      <div className={'select-none pt-2'}>
        <p className={'mb-2'}>简历正在导出中...关闭弹窗不影响导出(≧ω≦)</p>
        <p className={'g-line-bg-text mb-4'}>为了让本站持续【迭代】和【运转】下去，请站长喝杯咖啡吧～</p>
        <div className={'flex justify-between space-x-4'}>
          <div className={'flex-1'}>
            <Image
              className={'rounded border'}
              preview={false}
              src={'https://static.wktline.com/avatar/f4b50440fc6777340ad382c2a7313242.jpg'}
            ></Image>
            <p className={'text-center text-[color:#2DC252]'}>微信支付</p>
          </div>
          <div className={'flex-1'}>
            <Image
              className={'rounded border'}
              preview={false}
              src={'https://static.wktline.com/avatar/f61401068daac8cbd8b34cac53462b86.jpg'}
            ></Image>
            <p className={'text-center text-[color:#4992F3]'}>支付宝支付</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentLove;
