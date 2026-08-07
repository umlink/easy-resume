import { Cup, Drink } from '@icon-park/react';

export default () => {
  return (
    <>
      <p>1、免费不可长久，站点每年需要服务器、AI能力才能服务大家，微薄的会员费用则维持站点正常运转</p>
      <p>2、为了站点能长期维护下去，希望大家能有付费意识。</p>
      <p className={'flex'}>
        <span>3、若您觉的本站提供的服务值一杯 </span>
        <span className={'flex px-1 text-[#8f4c00]'}>
          <Cup theme="outline" size="18" />
        </span>
        <span> 或一杯 </span>
        <span className={'flex px-1 text-primary'}>
          <Drink theme="outline" size="18" />
        </span>
        <span>就交个朋友吧</span>
      </p>
    </>
  );
};
