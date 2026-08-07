import EmptyListSVG from '@/assets/common/empty-list.svg';
import useExportPDFById from '@/hooks/useExportPDFById';
import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';
import { isMobile } from '@/utils/tools';
import { Link } from '@umijs/max';
import {
  CopyLink,
  CopyOne,
  Delete,
  DownloadOne,
  Lock,
  MoreTwo,
  PageTemplate,
  Plus,
  PreviewOpen,
  ShareTwo,
  WritingFluently,
} from '@icon-park/react';
import { history, useModel } from '@umijs/max';
import { Button, Dropdown, MenuProps, message, Modal, Spin } from 'antd';
import copy from 'copy-to-clipboard';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

export default () => {
  const [modal, contextHolder] = Modal.useModal();
  const { state, getResumeData, onDelResume, onCopyResume, updateResumeAccessCode } = useModel('User.model');
  const { loadingId, onExportPdf } = useExportPDFById();

  const onDelConfirm = (item: API.ResumeItemVO, index: number) => {
    modal.confirm({
      title: '温馨提示',
      content: `确认删除【${item.title}】？`,
      okText: '确认',
      autoFocusButton: undefined,
      cancelText: '取消',
      onOk: () => onDelResume(item, index),
    });
  };

  const onCopyConfirm = (item: API.ResumeItemVO) => {
    modal.confirm({
      title: '复制确认',
      autoFocusButton: undefined,
      content: `确认复制【${item.title}】复制出一个副本？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => onCopyResume(item.id),
    });
  };

  const onShareConfirm = (item: API.ResumeItemVO) => {
    modal.confirm({
      title: '授权访问',
      autoFocusButton: undefined,
      content: `授权访问会生成一个访问码，可关闭访问权限`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => updateResumeAccessCode(+item.id, true),
    });
  };

  const onCopyShare = (item: API.ResumeItemVO) => {
    copy(`${location.origin}/preview/${item.id}?code=${item.accessCode}`);
    message.success('复制成功');
  };

  useEffect(getResumeData, []);

  const defaultImg = 'https://static.web3ling.com/images/836770b6efbeed466fdeb1a79310233e.jpg';
  const iconSize = 16;

  const getItemMenus = (item: API.ResumeItemVO, index: number): MenuProps['items'] => {
    const resumeData: IResumeData = {
      ...item,
      ...(item.content as any),
    };
    const actionItems: MenuProps['items'] = [
      {
        label: (
          <Link to={`/preview/${item.id}`} target={'_blank'}>
            预览简历
          </Link>
        ),
        key: 'preview',
        icon: <PreviewOpen fill={'#888'} size={iconSize} />,
      },
      {
        label: '编辑简历',
        key: 'editor',
        icon: <WritingFluently fill={'#888'} size={iconSize} />,
        onClick: () => {
          if (isMobile()) {
            message.warning('移动端编辑功能开发中，敬请期待～');
            return;
          }
          history.push(`/editor/${item.id}`);
        },
      },
      {
        label: '制作副本',
        key: 'copy',
        icon: <CopyOne fill={'#888'} size={iconSize} />,
        onClick: () => onCopyConfirm(item),
      },
      {
        label: '下载 PDF',
        key: 'download',
        icon: <DownloadOne fill={'#888'} size={iconSize} />,
        onClick: () => onExportPdf(resumeData),
      },
    ];

    if (item.accessCode) {
      actionItems.push(
        {
          label: '关闭预览授权',
          key: 'closeAccess',
          icon: <Lock fill={'#888'} size={iconSize} />,
          onClick: () => updateResumeAccessCode(+item.id, false),
        },
        {
          label: '复制授权链接',
          key: 'copyLink',
          icon: <CopyLink fill={'#888'} size={iconSize} />,
          onClick: () => onCopyShare(item),
        },
      );
    } else {
      actionItems.push({
        label: '授权分享',
        key: 'share',
        icon: <ShareTwo fill={'#888'} size={iconSize} />,
        onClick: () => onShareConfirm(item),
      });
    }

    actionItems.push({
      label: '删除简历',
      key: 'delete',
      icon: <Delete theme="outline" size={iconSize} />,
      danger: true,
      onClick: () => onDelConfirm(item, index),
    });
    return actionItems;
  };

  return (
    <div className={'border-1 rounded-xl border border-zinc-200 bg-white'}>
      <Spin spinning={state.loading}>
        {state.resumeList.map((item, index) => {
          return (
            <div key={item.id} className={'border-1 group flex border-b border-b-zinc-100 p-4 last:border-0'}>
              <img
                className={'h-[100px] w-[80px] rounded-xl object-cover shadow'}
                src={item.content.avatar.url || defaultImg}
              />
              <div className={'flex w-0  flex-1 flex-col justify-between pl-4 pr-2 pt-3 text-[14px] text-zinc-500'}>
                <div className={'flex items-center justify-between'}>
                  <Link
                    to={`/editor/${item.id}`}
                    className={'cursor-pointer text-[16px] font-bold !text-zinc-900'}
                    target={'_blank'}
                  >
                    {item.title}
                  </Link>
                  <span className={'text-zinc-900'}>{dayjs(item.updatedAt).fromNow()}</span>
                </div>
                <p className={'flex items-center space-x-4 font-light'}>
                  <span>
                    <span>状态：</span>
                    <span className={'font-normal'}>
                      {item.accessCode ? <span className={'text-emerald-500'}>授权可见</span> : <span>私有</span>}
                    </span>
                  </span>
                  {item.dataTmp === 1 && (
                    <span className={'text-primary'}>
                      <PageTemplate theme="outline" size="16" />
                    </span>
                  )}
                </p>
                <div className={'flex items-end justify-between font-light text-zinc-500'}>
                  <span>
                    模板编号：<span className={'text-orange-900'}>{item.templateCode}</span>
                  </span>
                  <div className={'flex items-center space-x-4'}>
                    <p className={'hidden text-[12px] md:block'}>
                      创建时间：
                      {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                    </p>
                    <Dropdown
                      menu={{ items: getItemMenus(item, index) }}
                      placement={'bottomRight'}
                      arrow={{ pointAtCenter: true }}
                    >
                      <span className={'cursor-pointer text-zinc-400 hover:text-zinc-900'}>
                        {loadingId === item.id ? (
                          <Spin size={'small'} />
                        ) : (
                          <MoreTwo theme="outline" strokeWidth={3} size={20} />
                        )}
                      </span>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!state.resumeList.length && (
          <div className={'flex h-[calc(100vh-87px)] flex-col items-center pt-[200px]'}>
            <img className={'mx-auto w-[400px]'} src={EmptyListSVG} alt="" />
            <Link to={'/'}>
              <Button type={'primary'} icon={<Plus />}>
                创建简历
              </Button>
            </Link>
          </div>
        )}
      </Spin>
      {contextHolder}
    </div>
  );
};
