import {useState} from "react";
import {useDidShow} from '@tarojs/taro'
import {View} from "@tarojs/components";
import ResumeItem from "./ResumeItem";
import request from "../../../request";

export type ResumeItemVO = {
  id: number;
  title: string;
  content: Record<string, any>;
  templateCode: string;
  accessCode: string;
  dataTmp: number;
  createdAt: string;
  updatedAt: string;
};

export default () => {
  const [resumeList, setResumeList] = useState<ResumeItemVO[]>([])
  const [downLoading, setDownLoading] = useState(false)
  const getResumeList = () => {
    request({
      url: "/resume/list",
      method: 'POST',
      params: { pageNum: 1, pageSize: 10 }
    }).then((res: any) => {
      setResumeList(res.data?.list || [])
    })
  }
  useDidShow(getResumeList)

  return (
    <View className='resume-list'>
      {
        !resumeList.length &&
        <View>
          <View className='empty-tips'>请先在 PC 端创建简历</View>
          <View className='empty-tips'>访问地址：请配置在 PC 端创建简历的入口</View>
          <View className='empty-tips'>创建简历后可在本页面进行 下载/预览</View>
        </View>
      }
      {resumeList.map((item: ResumeItemVO) => {
        return <ResumeItem key={item.id} data={item} loading={downLoading} onChangeLoading={(v: boolean) => setDownLoading(v)} />
      })}
    </View>
  )
}
