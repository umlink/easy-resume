import { createVipOrder, searchOrderStatus } from '@/api/Order';
import { getVipTypeList } from '@/api/VipType';
import PayImg from '@/components/VipContainer/PayImg';
import { VipTypeItem } from '@/components/VipContainer/VipTypeItem';
import { useModel } from '@umijs/max';
import { useSetState } from 'ahooks';
import { message, Typography } from 'antd';
import { useEffect, useState } from 'react';
import VipDesc from './VipDesc';

const { Paragraph } = Typography;

let loopTimer: any;

export default () => {
  const { initialState } = useModel('@@initialState');
  const { setGlobalData } = useModel('global');
  const { refreshUserInfo } = useModel('global');
  const [vipTypeList, setVipTypeList] = useState<API.VipTypeItemVo[]>([]);
  const [editData, setEditData] = useSetState({
    loading: false,
    vipTypeId: 0,
    payImgUrl: '',
  });

  const resetState = () => {
    setEditData({ loading: false, vipTypeId: 0, payImgUrl: '' });
  };

  const getAllVipTypes = () => {
    getVipTypeList().then((res) => {
      if (res.success) {
        let vipTypeList = res.data.sort((a, b) => a.price - b.price);
        setVipTypeList(vipTypeList);
      }
    });
  };

  let loopPayStatus = (orderId: string) => {
    if (!open) return;
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
    if (!initialState) {
      return setGlobalData({ openLogin: true });
    }
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

  useEffect(() => {
    getAllVipTypes();
    return () => clearTimeout(loopTimer);
  }, []);
  return (
    <div className={'pt-5'}>
      <Typography>
        <VipDesc />
        <Paragraph>
          <div className={`mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3`}>
            {vipTypeList.map((vip) => {
              if (editData.payImgUrl && vip.id === editData.vipTypeId) {
                return <PayImg key={vip.id} payImgUrl={editData.payImgUrl} />;
              }
              return <VipTypeItem key={vip.id} onPayVip={onPayVip} loading={editData.loading} vip={vip} />;
            })}
          </div>
        </Paragraph>
      </Typography>
    </div>
  );
};
