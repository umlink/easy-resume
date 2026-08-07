import { Wechat } from '@icon-park/react';

export default ({ payImgUrl }: { payImgUrl: string }) => {
  return (
    <div key={payImgUrl} className={'rounded-lg border border-zinc-300 p-5'}>
      <p className={'!mb-0 flex items-center justify-center space-x-1 text-center font-semibold text-green-600'}>
        <Wechat theme="outline" size="18" />
        <span className={'text-md font-semibold'}>微信扫码支付</span>
      </p>
      <img className={'w-full'} src={payImgUrl} alt="支付二维码" />
    </div>
  );
};
