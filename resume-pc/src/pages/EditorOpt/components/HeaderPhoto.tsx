import UploadImage from '@/components/UploadImage';
import { ResumeDataContext } from '@/context';
import { useModel } from '@@/exports';
import { UploadPicture } from '@icon-park/react';
import { useUpdateEffect } from 'ahooks';
import { Input, Switch, Tooltip } from 'antd';
import React, { useContext, useRef } from 'react';

const HeaderPhoto = (): JSX.Element => {
  const { globalData } = useModel('global');
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const ref = useRef<HTMLSpanElement>(null);

  const onFileSuccess = (data: API.UploadQiNiuResVo) => {
    resumeData.content.avatar.url = data.url;
    updateResume(resumeData);
  };

  const changeAvatarSize = (key: 'width' | 'height' | 'radius', e: any) => {
    resumeData.content.avatar[key] = +e.target.value ?? 0;
    updateResume(resumeData);
  };

  const changeAvatarShow = (checked: boolean) => {
    resumeData.content.avatar.show = checked;
    updateResume(resumeData);
  };

  useUpdateEffect(() => {
    ref.current?.click();
  }, [globalData.headerNoticeCount]);

  return (
    <div className={'py-3'}>
      <div className={'flex items-center justify-between'}>
        <span className={'g-line-before-title'}>证件照</span>
        <span className={'flex items-center space-x-4'}>
          <Tooltip title={resumeData.content.avatar.show ? '隐藏头像' : '显示头像'} placement={'top'}>
            <Switch size={'small'} checked={resumeData.content.avatar.show} onChange={changeAvatarShow} />
          </Tooltip>
          <UploadImage data={{ folder: 'avatar' }} onChange={onFileSuccess}>
            <Tooltip title="上传头像，最大2M" placement={'top'}>
              <span className={'flex text-primary'} ref={ref}>
                <UploadPicture theme="outline" size="20" fill="currentColor" />
              </span>
            </Tooltip>
          </UploadImage>
        </span>
      </div>
      {resumeData.content.avatar.show && (
        <div className={'mt-3 grid grid-cols-3 gap-2 text-right [&_.ant-input]:!text-right'}>
          <Input
            variant={'filled'}
            size={'small'}
            style={{ width: '100%', textAlign: 'right' }}
            value={resumeData.content.avatar.width}
            prefix={'宽'}
            onChange={(v) => changeAvatarSize('width', v)}
          />
          <Input
            variant={'filled'}
            size={'small'}
            style={{ width: '100%' }}
            value={resumeData.content.avatar.height}
            prefix={'高'}
            onChange={(v) => changeAvatarSize('height', v)}
          />
          <Input
            style={{ width: '100%' }}
            size={'small'}
            variant={'filled'}
            className={'text-right'}
            value={resumeData.content.avatar.radius}
            prefix={'弧'}
            onChange={(v) => changeAvatarSize('radius', v)}
          />
        </div>
      )}
    </div>
  );
};

export default HeaderPhoto;
