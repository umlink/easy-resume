import dayjs from "dayjs";
import {useLoad} from '@tarojs/taro'
import {Image, View} from "@tarojs/components";
import {useState} from "react";
import request from "../../../request";

// TODO: 替换为你的默认头像资源，开源版本默认使用 tabBar 的 user 图标作为占位
const defaultHeadImg = require('../../static/user-default.png')

export default () => {
  const [state, setState] = useState({
    username: "",
    avatar: "",
  })
  const [vipInfo, setVipInfo] = useState<any>()
  const getUserBaseInfo = () => {
    request({
      url: '/user/info',
    }).then((res: any) => {
      setState(res.data)
    })
    request({url: '/vip/info'}).then((res: any) => {
      if (res.success && res.data) {
        setVipInfo(res.data)
      }
    })
  }
  useLoad(() => {
    getUserBaseInfo()
  })
  const hasUserInfo = !!vipInfo
  return (
    <View className='base-info'>
      <Image className='user-avatar' src={state?.avatar || defaultHeadImg} mode='widthFix' />
      <View>
        <View className='user-name'>{state?.username || '轻简历'}</View>
        {
          hasUserInfo && <View className='expire-time'>
            {
              !!vipInfo.userId ? `会员过期时间：${dayjs(vipInfo?.expireTime).format("YYYY-MM-DD HH:mm")}` : '您的会员已过期，请在电脑端扫码支付开通'
            }
          </View>
        }
      </View>
    </View>
  );
}
