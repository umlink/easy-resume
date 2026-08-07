import { sendEmailCode } from '@/api/Email';
import { dataMigration } from '@/api/Resume';
import { LOCALHOST_ENUMS } from '@/constants/enums';
import { useModel } from '@umijs/max';
import { Button, Form, Input, message, Modal, Spin } from 'antd';
import React, { useState } from 'react';

const LoginContainer = () => {
  const [form] = Form.useForm();
  const [codeLoading, setCodeLoading] = useState(false);
  const { globalData, setGlobalData } = useModel('global');
  const [loading, setLoading] = useState(false);

  const sendCode = (e: any) => {
    e.stopPropagation();
    if (codeLoading) return;
    form.validateFields(['email']).then(({ email }) => {
      setCodeLoading(true);
      sendEmailCode({
        email,
        type: 'sync',
      })
        .then((res) => {
          if (res.success) {
            message.success('验证码发送成功');
          }
        })
        .finally(() => setCodeLoading(false));
    });
  };
  const onLogin = () => {
    if (loading) return;
    setLoading(true);
    form.validateFields().then((res) => {
      dataMigration(res)
        .then((res) => {
          if (res.success) {
            message.success('数据同步成功');
            localStorage.setItem(LOCALHOST_ENUMS.TOKEN, res.data);
            // 刷新页面数据
            location.reload();
          }
        })
        .finally(() => setLoading(false));
    });
  };

  return (
    <Modal
      title={'一键同步邮箱数据'}
      styles={{
        header: { padding: 0 },
      }}
      style={{ padding: 0 }}
      width={320}
      open={globalData.openSyncEmail}
      footer={null}
      onCancel={() => setGlobalData({ openSyncEmail: false })}
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
          <Form.Item className={'mb-3'}>
            <Button
              loading={loading}
              htmlType="submit"
              size={'large'}
              className={'flex-1 text-[14px]'}
              type={'primary'}
              onClick={onLogin}
              block
            >
              确认同步
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default LoginContainer;
