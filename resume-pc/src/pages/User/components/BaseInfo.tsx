import { BachelorCap, BeachUmbrella, Heartbeat, Mail, School, SettingTwo, User, Worker } from '@icon-park/react';
import { useModel } from '@umijs/max';
import { Avatar, Button } from 'antd';
import React from 'react';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { setState, state } = useModel('User.model');
  const descClass = 'text-zinc-700';
  const itemClass = 'flex items-start space-x-3';
  return (
    <div className={'hidden h-[calc(100vh-87px)] w-[300px] rounded-xl md:block'}>
      <div className={'fixed top-[75px] h-[calc(100vh-87px)] w-[300px] rounded-xl border border-zinc-200'}>
        <div className={'border-1 flex items-center justify-between border-b border-b-zinc-100 px-4 py-3'}>
          <div className={'flex items-center space-x-3'}>
            <Avatar
              className={'!bg-zinc-50 shadow'}
              icon={<User fill={'#333'} />}
              src={initialState?.avatar}
              size={40}
              shape={'square'}
            />
            <b>{initialState?.username}</b>
          </div>
          <Button onClick={() => setState({ isEdit: !state.isEdit })} icon={<SettingTwo size={14} />}></Button>
        </div>
        <div className={'space-y-4 p-4 text-[14px] text-zinc-400'}>
          <div className={itemClass}>
            <span>
              <School theme="outline" size={16} />
            </span>
            <p className={descClass}>{initialState?.school || '学校'}</p>
          </div>
          <div className={itemClass}>
            <span>
              <BachelorCap theme="outline" size={16} />
            </span>
            <p className={descClass}>{initialState?.discipline || '专业'}</p>
          </div>
          <div className={itemClass}>
            <span>
              <Mail theme="outline" size={16} />
            </span>
            <p className={descClass}>{initialState?.email}</p>
          </div>
          <div className={itemClass}>
            <span>
              <Worker theme="outline" size={16} />
            </span>
            <p className={descClass}>{initialState?.profession || '打工人'}</p>
          </div>
          <div className={itemClass}>
            <span>
              <Heartbeat theme="outline" size={16} />
            </span>
            <p className={descClass}>{initialState?.hobby || '摸鱼、睡觉、打瞌睡～'}</p>
          </div>
          <div className={itemClass}>
            <span>
              <BeachUmbrella theme="outline" size={16} />
            </span>
            <p className={descClass}>{initialState?.introduce || '优秀的打工人'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
