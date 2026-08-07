import { ResumeDataContext } from '@/context';
import ContentLineHeight from '@/pages/Editor/components/OperateModules/ContentLineHeight';
import ContentMargin from '@/pages/Editor/components/OperateModules/ContentMargin';
import HeaderPhoto from '@/pages/Editor/components/OperateModules/HeaderPhoto';
import LineSpace from '@/pages/Editor/components/OperateModules/LineSpace';
import Skill from '@/pages/Editor/components/OperateModules/Skill';
import ThemeColor from '@/pages/Editor/components/OperateModules/ThemeColor';
import TitleModule from '@/pages/Editor/components/OperateModules/TitleModule';
import PopupCloseIcon from '@/pages/Editor/components/PopupCloseIcon';
import { Popup } from 'antd-mobile';
import { useContext, useState } from 'react';

type PropsType = {
  children: JSX.Element;
};

export const configItemClass =
  'flex justify-between items-center text-[15px] py-2 border-b border-dashed border-b-zinc-200';
export const configItemValClass = 'px-2 py-1 min-w-[150px] rounded bg-zinc-100 text-center';

export default (props: PropsType) => {
  const [open, setOpen] = useState(false);
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  return (
    <div className={'flex'}>
      <Popup
        closeIcon={<PopupCloseIcon />}
        stopPropagation={[]}
        showCloseButton
        maskStyle={{ opacity: 0.3 }}
        visible={open}
        getContainer={null}
        bodyStyle={{ height: '60vh' }}
        onMaskClick={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div className={'p-3 border-t border-t-zinc-100'}>
          <div className={'pb-2 text-orange-500 text-[12px]'}>
            <b>简历微调</b>（可移步电脑端体验完整的操作体验）
          </div>
          <ThemeColor />
          <LineSpace />
          <ContentLineHeight />
          <HeaderPhoto />
          <ContentMargin />
          <TitleModule />
          <Skill />
        </div>
      </Popup>
      <span onClick={() => setOpen(true)}>{props.children}</span>
    </div>
  );
};
