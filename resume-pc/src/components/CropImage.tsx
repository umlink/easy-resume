import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

type PropsType = {
  aspect?: number;
  size?: number;
  children: React.ReactElement;
  onChange: (file: any) => void;
};
const CropImageModal = (props: PropsType) => {
  const { aspect = 1, onChange } = props;
  return (
    <ImgCrop
      aspect={aspect}
      // modalTitle={'头像裁剪'}
      modalOk={'确认裁剪'}
      modalCancel={'取消'}
      onModalOk={onChange}
    >
      <Upload className="flex" showUploadList={false}>
        {props.children}
      </Upload>
    </ImgCrop>
  );
};

export default CropImageModal;
