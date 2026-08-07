import { VIP_ENABLED } from '@/constants/feature-flags';
import { useModel } from '@umijs/max';
import React from 'react';
import { Button } from 'antd';
import { VipOne } from '@icon-park/react';
import VipInfo from './VipInfo';
import VipByModal from './VipByModal';

type PropsType = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
};

const VipContainer = ({ children, icon }: PropsType) => {
  const { globalData } = useModel('global');

  if (!VIP_ENABLED) return null;

  return (
    <div>
      {globalData.vipInfo ? (
        <VipInfo vipInfo={globalData.vipInfo}>
          {
            <Button
              shape="circle"
              type="text"
              icon={
                <span className={'flex text-amber-500'}>
                  <VipOne theme="outline" size="24" />
                </span>
              }
            />
          }
        </VipInfo>
      ) : (
        <VipByModal>
          <Button
            shape={children ? 'round' : 'circle'}
            icon={
              icon || (
                <span className={`flex text-zinc-400`}>
                  <VipOne theme="outline" size="20" />
                </span>
              )
            }
          >
            {children}
          </Button>
        </VipByModal>
      )}
    </div>
  );
};

export default VipContainer;
