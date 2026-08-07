import { useModel } from '@umijs/max';
import { Button } from 'antd';

type PropsType = {
  vip: API.VipTypeItemVo;
  loading: boolean;
  onPayVip: (id: number) => void;
};
export const VipTypeItem = ({ vip, loading, onPayVip }: PropsType) => {
  const { initialState } = useModel('@@initialState');
  return (
    <div
      key={vip.id}
      className={'space-y-4 rounded-xl border border-zinc-300 px-5 py-10 text-center text-[15px] text-zinc-500'}
    >
      <h2 className={'font-mono !text-[24px] font-extrabold text-zinc-900'}>{vip.title}</h2>
      <p>
        <span>限时优惠价：</span>
        <span className={'text-lg font-semibold text-amber-500'}>{vip.price}元</span>
      </p>
      <p>
        <span>原价：</span>
        <span className={'text-red-500 line-through'}>{vip.originalPrice}元</span>
      </p>
      <p>
        <span>AI智能检测：</span>
        <b className={'font-mono'}>{vip.checkCount}次</b>
      </p>
      <p>
        <span>内容优化额度：</span>
        <b className={'font-mono'}>{vip.optTokens?.toLocaleString()}</b>
      </p>
      <div>
        <p className={'outline-b text-zinc-600 underline'}>{vip.description}</p>
      </div>
      <div className={'pt-2'}>
        <Button type={'primary'} block shape={'round'} loading={loading} onClick={() => onPayVip(vip.id)}>
          {initialState?.isVip ? '点击续费' : '立即体验'}
        </Button>
      </div>
    </div>
  );
};
