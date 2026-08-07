import {Image, View} from "@tarojs/components";
import {useState} from "react";
import Taro, {useLoad} from "@tarojs/taro";
import request from "../../request";

type TemplateItemVO = {
  id: string;
  code: string;
  title: string;
  content: Record<string, any>;
  headerImg: string;
  isVip: number;
  tags: string[];
  useCount: number;
};

export default () => {
  const [templateList, setTemplateList] = useState<TemplateItemVO[]>([])

  useLoad(() => {
    request({
      url: "/template/list",
      method: 'POST',
      data: {pageNum: 1, pageSize: 100}
    }).then((res: any) => {
      setTemplateList(res.data?.list || [])
    })
  })

  const prewviewImg = (url: string) => {
    Taro.previewImage({
      urls: templateList.map(item => item.headerImg),
      current: url
    })
  }

  const openEditor = () => {
    Taro.navigateTo({
      url: '/pages/editor/index'
    })
  }

  return (
    <View className='template-list'>
      {templateList.map((item) => {
        return <View className='template-item' key={item.id}>
          <Image mode='widthFix'
            // onClick={() => prewviewImg(item.headerImg)}
            onClick={openEditor}
            preview={item.headerImg}
            className='template-img'
            src={item.headerImg}
          ></Image>
        </View>
      })}
    </View>
  )
}
