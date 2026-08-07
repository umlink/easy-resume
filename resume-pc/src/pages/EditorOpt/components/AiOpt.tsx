import VipContainer from '@/components/VipContainer';
import VipByModal from '@/components/VipContainer/VipByModal';
import { ResumeDataContext } from '@/context';
import { AI_ENABLED, VIP_ENABLED } from '@/constants/feature-flags';
import { useModel } from '@umijs/max';
import { Magic, SmartOptimization } from '@icon-park/react';
import { Button, Drawer, message, Popconfirm, Tooltip } from 'antd';
import { useContext, useEffect, useRef } from 'react';
import { useSetState, useMemoizedFn } from 'ahooks';
import { EventSourcePolyfill } from 'event-source-polyfill';
import QuillResumeEditor from '@/components/QuillResumeEditor';
import showdown from 'showdown';

export default () => {
  const { resumeData } = useContext(ResumeDataContext);
  const { globalData, getMyVipInfo, sendAiSseEvent } = useModel('global');
  const [optState, setOptState] = useSetState({
    content: '',
    open: false,
    loading: false,
  });
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, []);

  const optResumeHandler = useMemoizedFn(() => {
    if (optState.loading) return;
    setOptState({ loading: true });
    const messages: string[] = [];
    const converter = new showdown.Converter();
    let isOpened = false;
    eventSourceRef.current?.close();
    eventSourceRef.current = sendAiSseEvent(
      `/resume-api/ai/optimize/inspect?resumeId=${resumeData.id}`,
      (event: any) => {
        if (event.data.startsWith('done-')) {
          message.warning(event.data.replace('done-', ''));
          setOptState({ loading: false });
          return;
        }
        if (event.data === 'done') {
          setOptState({ loading: false });
          getMyVipInfo();
        } else {
          messages.push(event.data);
        }
        if (!isOpened) {
          isOpened = true;
          setOptState({ open: true });
        }
        setOptState({ content: converter.makeHtml([...messages].join('')) });
      },
    );
  });

  if (!AI_ENABLED) return null;

  const onOptResume = () => {
    if (optState.content) {
      return setOptState({ open: true });
    }
    optResumeHandler();
  };

  const icon = (
    <span className={'flex text-primary'}>
      <Magic strokeWidth={6} size={18} />
    </span>
  );

  const canDiagnose = !VIP_ENABLED || !!globalData.vipInfo;
  const btn = canDiagnose ? (
    <Button loading={optState.loading} icon={icon}></Button>
  ) : (
    <VipContainer icon={icon}></VipContainer>
  );

  return (
    <>
      <Tooltip title="AI诊断" placement={'top'}>
        {!!optState.content ? (
          <div onClick={() => setOptState({ open: true })}>{btn}</div>
        ) : (
          <Popconfirm
            title={<span>一键诊断简历全文内容？</span>}
            description={
              VIP_ENABLED ? (
                <div className={'mb-1 space-y-2 border-b border-b-zinc-100  pb-2 pr-2 pt-3'}>
                  <p>
                    您剩余可用AI诊断次数：<b>{globalData.vipInfo?.checkCount}</b>次
                  </p>
                  {!globalData.vipInfo?.checkCount && (
                    <div className={'flex items-center space-x-1'}>
                      <p>可通过续费会员继续使用</p>
                      <VipByModal>
                        <Button size={'small'} shape={'round'} color={'primary'} variant="outlined">
                          续费
                        </Button>
                      </VipByModal>
                    </div>
                  )}
                </div>
              ) : undefined
            }
            placement="bottomRight"
            okText="开始诊断"
            onConfirm={onOptResume}
            cancelText="取消"
            okButtonProps={{ disabled: VIP_ENABLED && !globalData.vipInfo?.checkCount }}
          >
            <div>{btn}</div>
          </Popconfirm>
        )}
      </Tooltip>
      <Drawer
        width={800}
        styles={{ body: { padding: 0 } }}
        title={
          <div className={'flex items-center justify-between'}>
            <span className={'flex items-center space-x-2 text-primary'}>
              <SmartOptimization theme="outline" size={20} />
              <span>AI简历优化建议</span>
            </span>
            <div className={'flex items-center space-x-2'}>
              {VIP_ENABLED && (
                <span className={'font-normal'}>
                  您剩余可用AI诊断次数：<b>{globalData.vipInfo?.checkCount}</b>次
                </span>
              )}
              <Button shape={'round'} size={'middle'} onClick={optResumeHandler} loading={optState.loading} icon={icon}>
                重新获取优化建议
              </Button>
            </div>
          </div>
        }
        onClose={() => setOptState({ open: false })}
        open={optState.open}
      >
        <div className={'p-4'}>
          <QuillResumeEditor
            insertLoading={optState.loading}
            placeholder={''}
            className={'h-full overflow-y-auto'}
            html={optState.content}
            readOnly={true}
            theme={'snow'}
          />
        </div>
      </Drawer>
    </>
  );
};
