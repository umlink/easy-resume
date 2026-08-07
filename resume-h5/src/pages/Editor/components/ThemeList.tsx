import Api from '@/api';
import { ResumeDataContext } from '@/context';
import PopupCloseIcon from '@/pages/Editor/components/PopupCloseIcon';
import { Close } from '@icon-park/react';
import { useRequest, useUpdateEffect } from 'ahooks';
import { ImageViewer, Popup, Toast } from 'antd-mobile';
import { useContext, useEffect, useState } from 'react';

type PropsType = {
  children: JSX.Element;
  onChange?: () => void;
};

export default (props: PropsType) => {
  const [open, setOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(-1);
  const { resumeData, updatedKey, updateResume } = useContext(ResumeDataContext);
  const [templateList, setTemplateList] = useState<API.TemplateItemVO[]>([]);

  const renderFooter = (image: string, index: number) => {
    const onSelectTheme = () => {
      const item = templateList[index];
      resumeData.templateCode = item.code;
      resumeData.content.config = item.content.config;
      resumeData.content.avatar = item.content.avatar;
      resumeData.content.margin = item.content.margin;
      updateResume(resumeData);
      setImgIndex(-1);
      setOpen(false);
    };

    return (
      <div className={'p-5 flex items-center justify-center text-center space-x-4'}>
        <span className={'px-4 py-2 bg-zinc-100 rounded-3xl border border-zinc-900'} onClick={onSelectTheme}>
          使用该模板 <b className={'text-primary'}>「{templateList[index].code}」</b>
        </span>
        <span
          className={'flex p-2 rounded-full bg-white shadow-md border border-zinc-900'}
          onClick={() => setImgIndex(-1)}
        >
          <Close theme="outline" size="16" fill="#000" />
        </span>
      </div>
    );
  };

  const { run: getResumeList } = useRequest(
    async () => {
      const res = await Api.Template.getTemplateList(
        {
          pageNum: 1,
          pageSize: 100,
        },
        {
          ignoreErrMsg: true,
        },
      );
      if (res.success) {
        setTemplateList(res.data?.list || []);
      }
    },
    {
      manual: true,
    },
  );

  useUpdateEffect(() => {
    Toast.clear();
    props.onChange?.();
  }, [updatedKey]);

  useEffect(() => {
    getResumeList();
  }, []);

  return (
    <div>
      <Popup
        visible={open}
        showCloseButton
        closeIcon={<PopupCloseIcon />}
        onMaskClick={() => setOpen(false)}
        onClose={() => setOpen(false)}
        bodyStyle={{ height: '100vh' }}
      >
        <div className={'grid grid-cols-2 gap-2 h-full overflow-y-auto p-2 bg-zinc-50 border-t border-t-zinc-100'}>
          {templateList.map((item, index) => {
            return (
              <div
                key={item.id}
                className={'h-[300px] overflow-hidden rounded border border-zinc-100'}
                onClick={() => setImgIndex(index)}
              >
                <img className={'mx-auto'} src={item.headerImg} />
              </div>
            );
          })}
        </div>
        {imgIndex}
        {imgIndex > -1 && (
          <ImageViewer.Multi
            images={templateList.map((item) => item.headerImg)}
            visible={true}
            defaultIndex={imgIndex}
            onClose={() => setImgIndex(-1)}
            onIndexChange={(index) => setImgIndex(index)}
            renderFooter={renderFooter}
          />
        )}
      </Popup>
      <span className={'flex'} onClick={() => setOpen(true)}>
        {props.children}
      </span>
    </div>
  );
};
