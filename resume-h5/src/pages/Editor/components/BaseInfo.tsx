import { ResumeDataContext } from '@/context';
import SvgIcons, { IconsMap } from '@/pages/components/SvgIcons';
import BaseInfoEditor from '@/pages/Editor/components/BaseInfoEditor';
import { Fill, NewPicture } from '@icon-park/react';
import { Image, ImageUploader, ImageUploadItem } from 'antd-mobile';
import { useContext, useState } from 'react';
export default () => {
  const { resumeData } = useContext(ResumeDataContext);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  const mockUpload = async (file: File) => {
    return {
      url: resumeData.content?.avatar?.url,
    };
  };

  return (
    <BaseInfoEditor>
      <div className={'bg-white text-[13px] border-b border-1 border-zinc-100 text-zinc-700'}>
        <div className={'flex items-end p-4'}>
          <div className={'mr-3 [&_.adm-space-item]:!pb-0'} onClick={(e) => e.stopPropagation()}>
            <ImageUploader maxCount={1} value={fileList} onChange={setFileList} upload={mockUpload}>
              {resumeData.content.avatar.url.length > 0 && (
                <Image
                  src={resumeData.content.avatar.url}
                  width={64}
                  height={74}
                  fit="cover"
                  style={{ borderRadius: 4 }}
                />
              )}
              {resumeData.content.avatar.url.length === 0 && (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#999999',
                  }}
                >
                  <NewPicture theme="outline" size="32" />
                </div>
              )}
            </ImageUploader>
          </div>
          <div>
            <h2 className={'text-[18px] font-bold g-line-bg-text'}>{resumeData.title}</h2>
            <p className={'mt-2 text-zinc-500'}>{resumeData.content?.config?.desc}</p>
          </div>
        </div>
        <div className={'grid grid-cols-2 mt-3 bg-gray-50 p-2'}>
          {resumeData.content.baseInfo.list?.map((info, index) => {
            const InfoIcon = info.icon ? IconsMap[info.icon] : Fill;
            return (
              <div key={index} className={`p-1 flex items-center`}>
                <span className={'flex mr-1'}>
                  <SvgIcons readOnly={true}>
                    <InfoIcon className={'text-[15px]'} />
                  </SvgIcons>
                </span>
                <span
                  style={{ textAlignLast: 'justify' }}
                  className={'inline-block min-w-[58px] w-[58px] text-zinc-600'}
                >
                  {info.key}
                </span>
                <span className={'flex-1 w-0 truncate'}>：{info.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </BaseInfoEditor>
  );
};
