import { ResumeDataContext } from '@/context';
import PopupCloseIcon from '@/pages/Editor/components/PopupCloseIcon';
import PreviewEditor from '@/pages/Editor/components/PreviewEditor';
import ThemeList from '@/pages/Editor/components/ThemeList';
import { SettingConfig, Theme } from '@icon-park/react';
import { FloatingBubble, Popup } from 'antd-mobile';
import { useContext, useState } from 'react';

type PropsType = {
  children: JSX.Element;
};

export default (props: PropsType) => {
  const { resumeData } = useContext(ResumeDataContext);
  const [refreshKey, setRefreshKey] = useState(0);
  const [open, setOpen] = useState(false);
  const scaleProportion = window.innerWidth / 800;
  return (
    <div className={'flex'}>
      <Popup
        visible={open}
        closeIcon={<PopupCloseIcon />}
        position={'left'}
        showCloseButton
        destroyOnClose
        stopPropagation={[]}
        onMaskClick={() => setOpen(false)}
        onClose={() => setOpen(false)}
        bodyStyle={{ minHeight: '100vh', width: '100vw' }}
      >
        <div>
          <div
            className={`w-[800px] origin-top-left border-t border-t-zinc-100`}
            style={{ transform: `scale(${scaleProportion})`, height: window.innerHeight / scaleProportion }}
          >
            <iframe
              key={refreshKey}
              className={'w-full h-full'}
              src={`https://www.wktline.com/preview/${resumeData.id}`}
              frameBorder="0"
            ></iframe>
          </div>
          <PreviewEditor />
          <ThemeList onChange={() => setRefreshKey(refreshKey + 1)}>
            <FloatingBubble
              axis="xy"
              magnetic="x"
              style={{
                '--initial-position-bottom': '32px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
              }}
            >
              <Theme theme="outline" size="24" />
            </FloatingBubble>
          </ThemeList>
          <PreviewEditor>
            <FloatingBubble
              axis="xy"
              magnetic="x"
              style={{
                '--initial-position-bottom': '90px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
              }}
            >
              <SettingConfig theme="outline" size="24" />
            </FloatingBubble>
          </PreviewEditor>
        </div>
      </Popup>
      <span
        onClick={() => {
          setRefreshKey(refreshKey + 1);
          setOpen(true);
        }}
      >
        {props.children}
      </span>
    </div>
  );
};
