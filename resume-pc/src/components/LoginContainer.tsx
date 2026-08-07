import { emailCodeLogin, emailPwdLogin } from '@/api/Auth';
import { sendEmailCode } from '@/api/Email';
import { MD5_SALT } from '@/constants';
import { LOCALHOST_ENUMS } from '@/constants/enums';
import { useModel } from '@umijs/max';
import { Button, Form, Input, message, Modal, Spin } from 'antd';
import React, { useState } from 'react';
import { Md5 } from 'ts-md5';

const LoginContainer = () => {
  const [form] = Form.useForm();
  const [codeLoading, setCodeLoading] = useState(false);
  const { globalData, setGlobalData, refreshUserInfo } = useModel('global');
  const [loginType, setLoginType] = useState<string>('pwd');
  const [loading, setLoading] = useState(false);

  const subTitleMap: Record<string, string> = {
    pwd: '邮箱密码登录',
    code: '邮箱验证码登录/注册',
  };

  const isPwdLogin = loginType === 'pwd';
  const isCodeLogin = loginType === 'code';

  const sendCode = (e: any) => {
    e.stopPropagation();
    if (codeLoading) return;
    form.validateFields(['email']).then(({ email }) => {
      setCodeLoading(true);
      sendEmailCode({
        email,
        type: 'login',
      })
        .then((res) => {
          if (res.success) {
            message.success('验证码发送成功');
          }
        })
        .finally(() => setCodeLoading(false));
    });
  };

  const loginByCode = (res: API.EmailCodeLoginDto) => {
    emailCodeLogin(res).then((res) => {
      setLoading(false);
      if (res.success) {
        message.success('登录成功');
        localStorage.setItem(LOCALHOST_ENUMS.TOKEN, res.data?.accessToken);
        setGlobalData({ openLogin: false });
        refreshUserInfo();
      }
    });
  };
  const loginByPwd = (data: API.EmailPwdLoginDto) => {
    data.password = Md5.hashStr(data.password + MD5_SALT);
    emailPwdLogin(data).then((res) => {
      setLoading(false);
      if (res.success) {
        message.success('登录成功');
        localStorage.setItem(LOCALHOST_ENUMS.TOKEN, res.data?.accessToken);
        setGlobalData({ openLogin: false });
        refreshUserInfo();
      }
    });
  };
  const onLogin = () => {
    setLoading(true);
    form
      .validateFields()
      .then((res) => {
        const method = isPwdLogin ? loginByPwd : loginByCode;
        method(res);
      })
      .catch(() => setLoading(false));
  };

  const forgetPwd = () => {
    setGlobalData({
      openLogin: false,
      openUpdatePwd: true,
    });
    form.resetFields();
  };

  return (
    <Modal
      title={<span className={'text-lg'}>{subTitleMap[loginType]}</span>}
      styles={{
        header: { padding: 0 },
      }}
      style={{ padding: 0 }}
      width={380}
      open={globalData.openLogin}
      footer={null}
      onCancel={() => setGlobalData({ openLogin: false })}
    >
      <div className={'select-none pb-2 pt-6'}>
        <Form form={form} layout="vertical" variant={'filled'} size={'large'}>
          <Form.Item name={'email'} rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input autoFocus placeholder="请输入邮箱" />
          </Form.Item>
          {isPwdLogin && (
            <>
              <Form.Item name={'password'} rules={[{ required: true, message: '请输入密码' }]}>
                <Input.Password autoComplete={'new-password'} placeholder="请输入密码" />
              </Form.Item>
              <Form.Item className={'mb-1'}>
                <div className={'flex items-center justify-between'}>
                  {isPwdLogin && (
                    <span className={'cursor-pointer hover:text-primary'} onClick={() => setLoginType('code')}>
                      验证码登录
                    </span>
                  )}
                  <span onClick={forgetPwd} className={'cursor-pointer text-[14px] text-zinc-500 hover:text-primary'}>
                    忘记密码
                  </span>
                </div>
              </Form.Item>
            </>
          )}
          {isCodeLogin && (
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
          )}
          {isCodeLogin && (
            <Form.Item className={'mb-4'}>
              <div className={'flex items-center justify-between text-right text-zinc-500'}>
                {/*<div className={'flex items-center space-x-1'}>*/}
                {/*  <span>其他登录方式:</span>*/}
                {/*  <span className={'flex cursor-pointer items-center justify-center rounded-full bg-green-50 p-1'}>*/}
                {/*    <Wechat theme="outline" size="16" fill={'#3CB371'} />*/}
                {/*  </span>*/}
                {/*</div>*/}
                {isCodeLogin && (
                  <span className={'cursor-pointer hover:text-primary'} onClick={() => setLoginType('pwd')}>
                    密码登录
                  </span>
                )}
              </div>
            </Form.Item>
          )}
          <Form.Item className={'mb-3'}>
            <div className={'flex justify-between space-x-4'}>
              {loginType === 'pwd' && (
                <Button size={'large'} className={'flex-1 text-[14px]'} onClick={() => setLoginType('code')}>
                  注册
                </Button>
              )}
              <Button
                loading={loading}
                htmlType="submit"
                size={'large'}
                className={'flex-1 text-[14px]'}
                type={'primary'}
                onClick={onLogin}
              >
                {isPwdLogin ? '登录' : '登录/注册'}
              </Button>
            </div>
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

export default LoginContainer;
