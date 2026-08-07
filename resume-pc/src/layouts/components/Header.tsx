import { ReactComponent as LogoSvg } from '@/assets/common/logo.svg';
import VipContainer from '@/components/VipContainer';
import { PROJECT_TITLE } from '@/constants';
import { VIP_ENABLED } from '@/constants/feature-flags';
import { history, useLocation } from '@umijs/max';
import React from 'react';
import UserAvatar from '@/layouts/components/UserAvatar';
import { NavLink } from '@umijs/max';
import { useModel } from '@umijs/max';

export default () => {
  const { initialState } = useModel('@@initialState');
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navList = [
    {
      path: '/template',
      name: '样式模板',
      target: '_self',
    },
    {
      path: '/content/client',
      name: '范文模板',
      target: '_self',
    },
    ...(VIP_ENABLED
      ? [
          {
            path: '/vip',
            name: '权益中心',
            target: '_self' as const,
          },
        ]
      : []),
    {
      path: '/recruitment',
      name: '招聘入口',
      target: '_self',
    },
    {
      path: '/guide',
      name: '避坑指南',
      target: '_self',
    },
  ];
  return (
    <div className={`sticky top-0 z-10 h-[55px] bg-white/50 backdrop-blur-sm ${isHome ? '' : 'shadow'}`}>
      <div className={`mx-auto flex h-full max-w-[1200px] items-center justify-between px-4`}>
        <div className={'flex items-center space-x-5 md:space-x-8'}>
          <div className={'flex cursor-pointer items-center space-x-2'} onClick={() => history.push('/')}>
            <LogoSvg className={'h-10 w-10'} />
            <b className={'text-lg font-extrabold tracking-wide'}>{PROJECT_TITLE}</b>
          </div>
          <div className={'hidden space-x-6 text-[15px] md:inline-block'}>
            {navList.map((nav) => {
              return (
                <NavLink
                  key={nav.path}
                  to={nav.path}
                  target={nav.target}
                  className={({ isActive }) =>
                    isActive ? 'g-line-bg-text font-bold overline' : 'text-zinc-500 hover:text-zinc-900'
                  }
                >
                  {nav.name}
                </NavLink>
              );
            })}
          </div>
        </div>
        <div className={'flex items-center space-x-4'}>
          {initialState?.id && <VipContainer>开通会员</VipContainer>}
          <UserAvatar />
        </div>
      </div>
    </div>
  );
};
