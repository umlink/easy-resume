import { createPropose } from '@/api/Propose';
import { subThemeColor } from '@/constants';
import { Close, Customer } from '@icon-park/react';
import { useModel, useRequest } from '@umijs/max';
import { Button, ConfigProvider, FloatButton, Image, Input, message, Popover } from 'antd';
import React, { useState } from 'react';

const FloatTools: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const { initialState } = useModel('@@initialState');
  const { setGlobalData } = useModel('global');

  const { loading, run: submitMsg } = useRequest(
    () =>
      createPropose({ message: msg }).then((res) => {
        if (res.success) {
          message.success('提交成功');
          setOpen(false);
          setMsg('');
        }
      }),
    {
      manual: true,
    },
  );

  const content = (
    <div className={'flex w-[500px] justify-between space-x-4'}>
      <div className={'flex-1 space-y-4 '}>
        <div className={'text-[14px] text-zinc-600'}>
          <p>请详细填写遇到的问题，我们收到后将在第一时间处理</p>
        </div>
        <div>
          <Input.TextArea
            value={msg}
            placeholder={'请输入您的宝贵提议'}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
            rows={5}
          />
        </div>
        <Button type={'primary'} block loading={loading} onClick={submitMsg}>
          提交
        </Button>
      </div>
      <div className={'space-y-4 border-l border-l-zinc-100 pl-4'}>
        <h3 className={'text-[14px] font-extrabold text-orange-500'}>如遇紧急问题可添加微信，注明来意</h3>
        <Image
          width={190}
          preview={false}
          src={'https://static.wktline.com/avatar/9eed126c9eaeaa7b76630bc9452110fc.jpg'}
        ></Image>
      </div>
    </div>
  );

  const onShow = () => {
    if (!initialState) {
      setGlobalData({ openLogin: true });
      return;
    }
    setOpen(!open);
  };

  const Title = () => {
    return (
      <div className={'flex items-center justify-between'}>
        <span className={'text-[16px]'}>问题反馈</span>
        <span className={'cursor-pointer'} onClick={() => setOpen(false)}>
          <Close />
        </span>
      </div>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: subThemeColor,
        },
      }}
    >
      <Popover content={content} open={open} placement={'topRight'} title={<Title />}>
        <FloatButton
          className={'!right-[16px] md:!right-[80px]'}
          style={{ bottom: 120 }}
          onClick={onShow}
          icon={<Customer />}
        />
      </Popover>
    </ConfigProvider>
  );
};

export default FloatTools;
