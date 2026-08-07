import Api from '@/api';
import { resetEmailPwd } from '@/api/Auth';
import { sendEmailCode } from '@/api/Email';
import { MD5_SALT } from '@/constants';
import { LOCALHOST_ENUMS } from '@/constants/enums';
import { useModel } from '@umijs/max';
import { Button, Form, Input, message, Modal, Spin } from 'antd';
import React, { useState } from 'react';
import { Md5 } from 'ts-md5';

const VipContainer = () => {
  const [form] = Form.useForm();
  const [codeLoading, setCodeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setInitialState } = useModel('@@initialState');
  const { globalData, setGlobalData } = useModel('global');

  const getUserInfo = () => {
    Api.User.getUserInfo().then((res) => {
      if (res.success) {
        setInitialState(res.data);
      }
    });
  };

  const sendCode = (e: any) => {
    e.stopPropagation();
    if (codeLoading) return;
    form.validateFields(['email']).then(({ email }) => {
      setCodeLoading(true);
      sendEmailCode({
        email,
        type: 'changePwd',
      })
        .then((res) => {
          if (res.success) {
            message.success('验证码发送成功');
          }
        })
        .finally(() => setCodeLoading(false));
    });
  };

  const onSubmit = () => {
    setLoading(true);
    form
      .validateFields()
      .then((res) => {
        res.password = Md5.hashStr(res.password + MD5_SALT);
        resetEmailPwd(res).then((res) => {
          setLoading(false);
          if (res.success) {
            localStorage.setItem(LOCALHOST_ENUMS.TOKEN, res.data?.accessToken);
            setGlobalData({ openUpdatePwd: false });
            getUserInfo();
            form.resetFields();
            message.success('修改成功，已登录');
          }
        });
      })
      .catch(() => setLoading(false));
  };

  return (
    <Modal
      title={<span className={'text-lg'}>修改邮箱登录密码</span>}
      styles={{
        header: { padding: 0 },
      }}
      style={{ padding: 0 }}
      width={380}
      open={globalData.openUpdatePwd}
      footer={null}
      onCancel={() => setGlobalData({ openUpdatePwd: false })}
    >
      <div className={'select-none pb-2 pt-6'}>
        <Form form={form} layout="vertical" variant={'filled'} size={'large'}>
          <Form.Item name={'email'} rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input autoFocus placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name={'code'} rules={[{ required: true, message: '请输入验证码' }]}>
            <Input
              className={'select-none'}
              placeholder="请输入验证码"
              maxLength={6}
              minLength={6}
              suffix={
                <Spin spinning={codeLoading} size={'small'}>
                  <span className={'cursor-pointer text-[14px] text-primary'} onClick={sendCode}>
                    发送验证码
                  </span>
                </Spin>
              }
            />
          </Form.Item>
          <Form.Item name={'password'} rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password autoComplete={'new-password'} placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              htmlType="submit"
              size={'large'}
              onClick={onSubmit}
              className={'flex-1 text-[14px]'}
              type={'primary'}
              block
            >
              确认修改
            </Button>
          </Form.Item>
        </Form>
        {/*<div className={'space-x-1 text-xs font-light text-zinc-400'}>*/}
        {/*  <span>注册登录即表示同意</span>*/}
        {/*  <b className={'cursor-pointer text-primary'}>《用户协议》</b>*/}
        {/*  <span>和</span>*/}
        {/*  <b className={'cursor-pointer text-primary'}>《隐私政策》</b>*/}
        {/*</div>*/}
      </div>
    </Modal>
  );
};

export default VipContainer;
