import Taro, {useLoad} from '@tarojs/taro'
import {Image, Text, View} from '@tarojs/components'
import request from "../../request";
import TemplateList from "./TemplateList";
import './style.less'

export default function Index () {
  const onLogin = () => {
    Taro.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          request({
            url: "/auth/wxmp/auto-login",
            method: "POST",
            data: { code: res.code },
          }).then((ret) => {
            if (ret.success) {
              Taro.setStorageSync('TOKEN', ret.data)
            }
          })
        } else {
          console.log("登录失败！" + res.errMsg);
        }
      },
    });
  };
  useLoad(onLogin)

  return (
    <View className='home-container'>
      <View className='header'>
        <Image style={{width: 140, height: 140}} mode='aspectFit'
          // TODO: 替换为你的 logo 资源，开源版本默认使用 tabBar 的 user 图标作为占位
          src={require('../../static/user-default.png')}
        />
        <Text className='title'>轻简历</Text>
        <View className='tips'>
          <View>新用户注册即 <Text className='important'>送一天体验会员</Text></View>
          <View>为自己喜欢的产品付费</View>
        </View>
      </View>
      <View className='introduction'>
        <View>1. 丰富的简历模板，分单页多页，自由选择</View>
        <View>2. 丰富的内容样例，按职业从容编辑简历</View>
        <View>3. 招聘快捷入口，提供丰富的地方招聘入口</View>
        <View>4. 找工作避坑指南，求职路上少踩坑</View>
      </View>
      <View className='desc'>编辑简历请在 PC 端操作</View>
      <TemplateList />
    </View>
  )
}
