import { sendEmailCode } from '@/api/Email';
import { editUserInfo } from '@/api/User';
import UploadImage from '@/components/UploadImage';
import { UploadPicture } from '@icon-park/react';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Form, Input, InputNumber, message } from 'antd';
import React, { useState } from 'react';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

export default () => {
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const { setState } = useModel('User.model');
  const [emailChanged, setEmailChanged] = useState(false);
  const { refreshUserInfo } = useModel('global');
  const [avatar, setAvatar] = useState(initialState?.avatar);

  const { loading, run: onFinish } = useRequest((values) => editUserInfo(values), {
    onSuccess: (res) => {
      if (res.success) {
        message.success('修改成功');
        setState({ isEdit: false });
        refreshUserInfo();
      }
    },
    manual: true,
  });

  const onFileSuccess = (data: API.UploadQiNiuResVo) => {
    form.setFieldValue('avatar', data.url);
    setAvatar(data.url);
  };

  const checkEmail = (e: any) => {
    const email = e.target.value;
    if (email && email !== initialState?.email) {
      return setEmailChanged(true);
    }
    setEmailChanged(false);
  };

  const sendSmCode = () => {
    sendEmailCode({
      email: form.getFieldValue('email'),
      type: 'updateInfo',
    }).then((res) => {
      if (res.success) {
        message.success('验证码发送成功');
      }
    });
  };

  const uploadContainer = `
        border-1 flex h-[100px] w-[100px] cursor-pointer
        items-center justify-center rounded-xl
        overflow-hidden
        border border-dashed border-zinc-300`;

  return (
    <div className={'border-1 absolute inset-0 overflow-hidden rounded-xl border border-zinc-200 bg-white'}>
      <h4 className={'border-1 border-b border-b-zinc-100 p-4'}>
        <b>修改个人信息</b>
      </h4>
      <div className={'h-[calc(100%-54px)] overflow-y-auto py-10'}>
        <Form
          form={form}
          className={'mx-auto min-h-[580px] px-4'}
          {...formItemLayout}
          onFinish={onFinish}
          initialValues={initialState}
          variant="filled"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="头像" name="avatar">
            <UploadImage data={{ folder: 'avatar' }} width={100} height={100} onChange={onFileSuccess}>
              <div className={uploadContainer}>
                {avatar ? (
                  <img className={'h-[100px] w-[100px] object-cover'} src={avatar} alt="" />
                ) : (
                  <button style={{ border: 0, background: 'none' }} type="button">
                    <UploadPicture theme="outline" size="30" strokeWidth={4} fill={'#999'} />
                  </button>
                )}
              </div>
            </UploadImage>
          </Form.Item>
          <Form.Item label="昵称" name="username" rules={[{ required: true, message: '昵称不能为空' }]}>
            <Input placeholder={'请输入昵称'} />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '邮箱不能为空' }]}>
            <Input
              placeholder={'请输入邮箱'}
              onBlur={checkEmail}
              suffix={
                emailChanged ? (
                  <span className={'cursor-pointer text-[14px] text-zinc-500 hover:text-primary'} onClick={sendSmCode}>
                    发送验证码
                  </span>
                ) : null
              }
            />
          </Form.Item>
          {emailChanged && (
            <Form.Item label="验证码" name="accessCode" rules={[{ required: true, message: '邮箱验证码不能为空' }]}>
              <Input placeholder={'请输入新的邮箱验证码'} />
            </Form.Item>
          )}
          <Form.Item label="学校" name="school">
            <Input placeholder={'北京清华大学'} />
          </Form.Item>
          <Form.Item label="专业" name="discipline">
            <Input placeholder={'软件工程'} />
          </Form.Item>
          <Form.Item label="职业" name="profession">
            <Input placeholder={'前端架构师'} />
          </Form.Item>
          <Form.Item label="年龄" name="age">
            <InputNumber placeholder={'30'} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="个人爱好" name="hobby">
            <Input placeholder={'吃饭、睡觉、打豆豆'} />
          </Form.Item>
          <Form.Item label="个人介绍" name="introduce">
            <Input.TextArea
              rows={3}
              placeholder={'我是一名爱好广泛、才华横溢的音乐家，喜欢用音乐和表演来传递情感和能量'}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
            <div className={'space-x-4'}>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
              <Button onClick={() => setState({ isEdit: false })}>取消</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
