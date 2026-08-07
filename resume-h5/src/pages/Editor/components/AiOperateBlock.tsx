import { ResumeDataContext } from '@/context';
import DeleteAIOptBtn from '@/pages/Editor/components/DeleteAIOptBtn';
import PopupCloseIcon from '@/pages/Editor/components/PopupCloseIcon';
import { Optimize } from '@icon-park/react';
import { useModel } from '@umijs/max';
import { useMemoizedFn, useSetState } from 'ahooks';
import { Dialog, Popup, Toast } from 'antd-mobile';
import { MdPreview } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useContext, useRef } from 'react';

export default () => {
  const { resumeData } = useContext(ResumeDataContext);
  const { globalData, getMyVipInfo, sendAiSseEvent } = useModel('global');
  const manualClose = useRef(false);

  const [optState, setOptState] = useSetState({
    content: '',
    open: false,
    loading: false,
    manualClose: false,
  });

  const optResumeHandler = useMemoizedFn(() => {
    if (optState.loading) return;
    Toast.show({
      icon: 'loading',
      content: '分析中',
    });
    const messages: string[] = [];
    sendAiSseEvent(`/resume-api/ai/optimize/inspect?resumeId=${resumeData.id}`, (event: any) => {
      if (event.data.startsWith('done-')) {
        setOptState({ loading: false });
        return;
      }
      if (event.data === 'done') {
        setOptState({ loading: false });
        getMyVipInfo();
      } else {
        messages.push(event.data);
      }
      Toast.clear();
      setOptState({
        open: manualClose.current ? optState.open : true,
        content: [...messages].join(''),
      });
    });
  });
  const onConfirm = () => {
    manualClose.current = false;
    if (optState.content) {
      setOptState({ open: true });
      return;
    }
    Dialog.confirm({
      title: '简历内容诊断',
      confirmText: '开始诊断',
      content: (
        <div className={'space-y-2 text-zinc-600'}>
          <p className={'text-zinc-900'}>
            您剩余可用AI诊断次数：<b>{globalData.vipInfo?.checkCount}</b>次
          </p>
          <p>1. 识别错别字</p>
          <p>2. 检索不合理描述和语境</p>
          <p>3. 梳理明显错误问题</p>
          <p>4. ...</p>
        </div>
      ),
      onConfirm: () => optResumeHandler(),
    });
  };

  const onDeleteAIContent = () => {
    manualClose.current = false;
    setOptState({
      open: false,
      content: '',
    });
  };

  return (
    <>
      <Popup
        visible={optState.open}
        closeIcon={
          <div className={'flex items-center space-x-4'}>
            <span onClick={onDeleteAIContent}>
              <DeleteAIOptBtn />
            </span>
            <span
              onClick={() => {
                setOptState({ open: false });
                manualClose.current = true;
              }}
            >
              <PopupCloseIcon />
            </span>
          </div>
        }
        position={'bottom'}
        showCloseButton
        destroyOnClose
        stopPropagation={[]}
        onMaskClick={() => setOptState({ open: false })}
        bodyStyle={{ minHeight: '100vh', width: '100vw' }}
      >
        <div className={'ai-opt-content p-3 h-screen overflow-y-auto border-t}'}>
          {/*<QuillEditor insertLoading={true} placeholder={''} html={optState.content} readOnly={true} theme={'snow'} />*/}
          <MdPreview modelValue={optState.content} previewTheme={'github'} />
        </div>
      </Popup>
      <span className={'action-span-btn text-primary'} onClick={onConfirm}>
        <Optimize theme="outline" size="24" />
      </span>
    </>
  );
};
