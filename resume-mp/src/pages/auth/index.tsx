import {useState} from "react";
import {Button, Image, Text, View} from "@tarojs/components";
import Taro, {useLoad} from "@tarojs/taro";
import "./index.less";
import request from "../../request";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [verifyCode, setVerifyCode] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  useLoad((params) => {
    if (params.scene?.includes('-')) {
      const codes = params.scene.split('-')
      setVerifyCode(codes[0])
      setInviteCode(codes[1])
      return
    }
    setVerifyCode(params.scene)
  });

  const onLogin = () => {
    setLoading(true);
    Taro.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          request({
            url: "/auth/wxmp/code-login",
            method: "POST",
            data: { code: res.code, verifyCode, inviteCode },
          }).then((ret) => {
            if (ret.success) {
              Taro.setStorageSync('TOKEN', ret.data)
              Taro.showToast({
                title: "登录成功",
                icon: "success",
                duration: 2000,
                success: () => {
                  Taro.switchTab({ url: "/pages/index/index" });
                },
              });
            } else {
              Taro.showToast({
                title: '授权异常',
                icon: "error",
                duration: 2000
              });
            }
          }).finally(() => {
            setLoading(false)
          });
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  };

  return (
    <View className='page-auth'>
      <View className='logo-warp'>
        <Image
          className='logo'
          mode='aspectFit'
          // TODO: 替换为你的 logo 资源，开源版本默认使用 tabBar 的 user 图标作为占位
          src={require('../../static/user-default.png')}
        ></Image>
        <View className='title'><Text>轻简历</Text></View>
      </View>
      <Button loading={loading} onClick={onLogin}>
        确认登录
      </Button>
    </View>
  );
}
