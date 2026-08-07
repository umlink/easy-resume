import dayjs from "dayjs";
import Taro from "@tarojs/taro";
import {Image, Text, View} from "@tarojs/components";
import {ResumeItemVO} from "./ResumeList";
import request, { baseUrl } from "../../../request";

type PropsType = {
  data: ResumeItemVO,
  loading: boolean,
  onChangeLoading: (v: boolean) => void
}

export default ({data, loading, onChangeLoading}: PropsType) => {

  const downLoadFile = (authCode: string) => {
    Taro.downloadFile({
      url: `${baseUrl}/puppeteer/pdf?authCode=${authCode}`,
    }).then(res => {
      const filePath = res.tempFilePath
      // 获取文件管理器实例
      const fileManager = Taro.getFileSystemManager();

      const newFilePath = `${Taro.env.USER_DATA_PATH}/${data.content.title}.pdf`
      // 保存文件，指定自定义的文件名（如中文名）
      fileManager.saveFile({
        tempFilePath: filePath,
        filePath: newFilePath, // 指定保存路径和文件名
        success: function (result) {
          Taro.openDocument({
            filePath: result.savedFilePath,
            fileType: 'pdf',
            showMenu: true,
            success() {
              Taro.hideLoading()
              onChangeLoading(false)
              fileManager.removeSavedFile({
                filePath: filePath,
              });
              fileManager.removeSavedFile({
                filePath: result.savedFilePath,
              });
            },
            fail() {
              Taro.showToast({title: '下载失败，请重试'})
              Taro.hideLoading()
              onChangeLoading(false)
            }
          })
        },
        fail: function (error) {
          console.error('文件保存失败:', error);
        }
      });
    }).catch(err => {
      console.log(err)
    })
  }

  const onDownLoad = () => {
    if (loading) return
    onChangeLoading(true);
    Taro.showLoading({
      title: '下载中...',
    })
    request({url: `/resume/pdf/${data.id}`}).then((res: any) => {
      if (res.success ) {
        downLoadFile(res.data)
      } else {
        Taro.hideLoading()
        onChangeLoading(false);
        Taro.showToast({
          icon: 'error',
          title: res.message
        })
      }
    })

  }
  return (
    <View className='resume-item'>
      <Image className='avatar' mode='widthFix' src={data.content.avatar.url}></Image>
      <View className='content'>
        <View className='title'>{data.content.title}</View>
        <View className='update-time'>更新时间：{dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</View>
        <View className='actions'>
          <View className='status'>{!!data.accessCode ? <Text className='public'>授权公开</Text> : <Text className='private'>私有</Text>}</View>
          <View>
            <Text className='action-btn' onClick={onDownLoad}>预览/下载</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
