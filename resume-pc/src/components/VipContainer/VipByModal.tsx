import { createVipOrder, searchOrderStatus } from '@/api/Order';
import { getVipTypeList } from '@/api/VipType';
import PayImg from '@/components/VipContainer/PayImg';
import { VipTypeItem } from '@/components/VipContainer/VipTypeItem';
import { Vip } from '@icon-park/react';
import { useModel } from '@umijs/max';
import { useSetState, useUpdateEffect } from 'ahooks';
import { message, Modal, Spin } from 'antd';
import { useState } from 'react';
import PayDesc from './PayDesc';
import VipDesc from '@/components/VipContainer/VipDesc';

type PropsType = {
  children?: React.ReactNode;
};

let loopTimer: any;

export default (props: PropsType) => {
  const { refreshUserInfo } = useModel('global');
  const [open, setOpen] = useState(false);
  const [vipTypeList, setVipTypeList] = useState<API.VipTypeItemVo[]>([]);
  const [editData, setEditData] = useSetState({
    loading: false,
    vipTypeId: 0,
    payImgUrl: '',
  });
  const getAllVipTypes = () => {
    getVipTypeList().then((res) => {
      if (res.success) {
        let vipTypeList = res.data.sort((a, b) => a.price - b.price);
        setVipTypeList([...vipTypeList]);
      }
    });
  };

  const resetState = () => {
    setOpen(false);
    clearTimeout(loopTimer);
    setEditData({ loading: false, vipTypeId: 0, payImgUrl: '' });
  };

  const loopPayStatus = (orderId: string) => {
    searchOrderStatus({ orderId }).then((res) => {
      if (res.success) {
        if (res.data) {
          resetState();
          refreshUserInfo();
          message.success('支付成功');
        } else {
          loopTimer = setTimeout(() => loopPayStatus(orderId), 2000);
        }
      } else {
        message.warning(res.message || '查询订单状态异常，请刷新页面查看');
      }
    });
  };

  const onPayVip = (id: number) => {
    if (editData.loading) return;
    setEditData({ loading: true, vipTypeId: id, payImgUrl: '' });
    createVipOrder({ vipTypeId: +id }).then((res) => {
      if (res.success) {
        clearTimeout(loopTimer);
        loopPayStatus(res.data.orderId);
        setEditData({ loading: false, payImgUrl: res.data.payImgUrl });
      } else {
        message.error(res.message || '下单失败，请重试或联系客服');
      }
    });
  };

  useUpdateEffect(() => {
    if (open) {
      getAllVipTypes();
    }
  }, [open]);

  const modalWidth = vipTypeList.length > 2 ? 900 : 550;

  return (
    <>
      <div onClick={() => setOpen(true)}>{props.children}</div>
      <Modal
        width={modalWidth}
        open={open}
        title={
          <span className={'flex items-center space-x-2 text-[18px]'}>
            <Vip theme="outline" size="20" fill="#333" />
            <span>请按需开通会员</span>
          </span>
        }
        footer={null}
        onCancel={resetState}
      >
        <div className={'space-y-5 py-3'}>
          <div className={'space-y-2 text-zinc-600'}>
            <VipDesc />
            <PayDesc />
          </div>
          <Spin spinning={editData.loading}>
            <div className={`grid gap-4 ${vipTypeList.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {vipTypeList.map((vip) => {
                if (editData.payImgUrl && vip.id === editData.vipTypeId) {
                  return <PayImg key={vip.id} payImgUrl={editData.payImgUrl} />;
                }
                return <VipTypeItem key={vip.id} onPayVip={onPayVip} loading={editData.loading} vip={vip} />;
              })}
            </div>
          </Spin>
        </div>
      </Modal>
    </>
  );
};
