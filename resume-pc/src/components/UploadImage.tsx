import { LOCALHOST_ENUMS } from '@/constants/enums';
import { notification, Spin, Upload, message } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

type PropsType = {
  width?: number;
  height?: number;
  data?: Record<string, string>;
  children: React.ReactElement;
  className?: string;
  onChange: (data: API.UploadQiNiuResVo) => void;
};
const accept = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const CropImageModal = (props: PropsType) => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: RcFile): Promise<File> | boolean => {
    if (!accept.includes(file.type!)) {
      notification.warning({
        message: '提示',
        description: '只支持png、jpg、jpeg格式的图片',
        duration: 3,
      });
      setLoading(false);
      return false;
    } else if (file.size! > 1024 * 1024 * 2) {
      notification.warning({
        message: '提示',
        description: '图片大小不超过2M',
        duration: 3,
      });
      setLoading(false);
      return false;
    }
    setLoading(true);
    return Promise.resolve(file);
  };
  const onChange = ({ file }: UploadChangeParam<UploadFile>) => {
    if (file.status === 'done') {
      setLoading(false);
      message.success('上传成功');
      props.onChange(file.response.data);
    }
  };
  const jwtToken = localStorage.getItem(LOCALHOST_ENUMS.TOKEN) || '';
  return (
    <Upload
      data={props.data || {}}
      action={'/resume-api/upload/file'}
      headers={{ [LOCALHOST_ENUMS.TOKEN]: jwtToken }}
      className={`flex cursor-pointer ${props.className}`}
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={onChange}
    >
      <Spin spinning={loading}>
        <div style={{ width: props.width, height: props.height }}>{props.children}</div>
      </Spin>
    </Upload>
  );
};

export default CropImageModal;
