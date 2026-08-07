import {View} from "@tarojs/components";
import BaseInfo from './components/BaseInfo'
import ResumeList from './components/ResumeList'
import './style.less'


export default function Mine() {
  return (
    <View className='page-mine'>
      <BaseInfo />
      <ResumeList />
    </View>)
}
