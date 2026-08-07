import VipDescriptionModal from '@/components/VipContainer/VipByModal';
import { generateInviteUrl } from '@/utils/funs-tools';
import { ShareOne, Tips, Vip } from '@icon-park/react';
import { Button, Divider, Popover } from 'antd';
import dayjs from 'dayjs';

type PropsType = {
  children: JSX.Element;
  vipInfo: API.VipInfoVO;
};

export default ({ children, vipInfo }: PropsType) => {
  return (
    <Popover
      placement={'bottomRight'}
      content={
        <div className={'p-3'}>
          <div className={'space-y-1'}>
            <p className={'flex justify-between text-zinc-500'}>
              <span>到期时间</span>
              <b className={'text-zinc-800'}>{dayjs(vipInfo.expireTime).format('YYYY-MM-DD HH:mm')}</b>
            </p>
            <p className={'flex justify-between text-zinc-500'}>
              <span>剩余AI诊断次数</span>
              <span>
                <b className={'text-zinc-800'}>{vipInfo.checkCount}</b>次
              </span>
            </p>
            <p className={'flex justify-between text-zinc-500'}>
              <span>剩余内容优化额度</span>
              <span>
                <b className={'text-zinc-800'}>{vipInfo.optTokens?.toLocaleString()}</b> tokens
              </span>
            </p>
          </div>
          <Divider style={{ margin: '8px 0' }} />
          <div className={'mb-4 space-y-3'}>
            <h3 className={'g-line-bg-text font-semibold'}>邀请有礼活动</h3>
            <div className={'space-y-2 text-zinc-900'}>
              <p className={'flex items-center'}>
                <span>1、每邀请一位新用户</span>
                <span className={'text-amber-500'}>注册</span>
                <span>，赠送 </span>
                <b className={'text-md px-1 !text-amber-500'}>1</b>
                <span> 天会员</span>
              </p>
              <p className={'flex items-center'}>
                <span>2、每邀请一位新用户</span>
                <span className={'text-amber-500'}>开通会员</span>
                <span>，再赠送</span>
                <b className={'text-md px-1 text-amber-500'}>3</b>
                <span>天会员</span>
              </p>
            </div>
          </div>
          <div className={'flex items-center space-x-2'}>
            <VipDescriptionModal>
              <Button icon={<Vip theme="outline" />} shape={'round'}>
                续费
              </Button>
            </VipDescriptionModal>
            <Button
              type={'primary'}
              onClick={generateInviteUrl}
              shape={'round'}
              block
              icon={<ShareOne theme="outline" />}
            >
              邀请新用户
            </Button>
          </div>
        </div>
      }
      title={
        <p className={'flex items-center space-x-1 text-[16px]'}>
          <span className={'flex text-amber-500'}>
            <Tips theme="outline" size="20" />
          </span>
          <span>会员信息</span>
        </p>
      }
      trigger="hover"
    >
      {children}
    </Popover>
  );
};
