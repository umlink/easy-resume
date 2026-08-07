import { LOCALHOST_ENUMS } from '@/constants/enums';
import { Power, User } from '@icon-park/react';
import { history, useModel } from '@umijs/max';
import { Avatar, Dropdown, MenuProps } from 'antd';
import React from 'react';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { setGlobalData } = useModel('global');

  const onLogout = () => {
    localStorage.removeItem(LOCALHOST_ENUMS.TOKEN);
    location.href = '/';
  };

  const AvatarNav = (props: any) => {
    return (
      <span {...props}>
        <Avatar
          className={'cursor-pointer !bg-zinc-50'}
          size={40}
          shape={'circle'}
          src={initialState?.avatar}
          icon={<User fill={'#333'} />}
        />
      </span>
    );
  };
  if (!initialState) {
    return <AvatarNav onClick={() => setGlobalData({ openLogin: true })} />;
  }

  const MenuItems: MenuProps['items'] = [
    {
      label: '我的主页',
      key: 'home',
      icon: <User theme="outline" />,
      onClick: () => history.push('/user'),
    },
    {
      label: '退出登录',
      key: 'logout',
      danger: true,
      icon: <Power theme="outline" />,
      onClick: onLogout,
    },
  ];

  return (
    <Dropdown menu={{ items: MenuItems }} placement="bottomRight" trigger={['hover']}>
      <AvatarNav />
    </Dropdown>
  );
};
