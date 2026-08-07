import { deleteGuide, getGuideDetail } from '@/api/Guide';
import AccessAdmin from '@/components/AccessAdmin';
import QuillEditor from '@/components/QuillEditor';
import { useRequest } from '@umijs/max';
import { useEffect, useState } from 'react';
import { useParams, history } from '@umijs/max';
import { Modal, Spin, message } from 'antd';
import { Editor, Delete, LoudlyCryingFace } from '@icon-park/react';

export default () => {
  const [modal, contextHolder] = Modal.useModal();
  const [detail, setDetail] = useState<API.GuideDetailDto>();
  const params = useParams();

  const { run: getData, loading } = useRequest(
    (id: number) =>
      getGuideDetail({ id }).then((res) => {
        if (res.success) {
          setDetail(res.data);
        }
      }),
    { manual: true },
  );

  const onDel = () => {
    modal.confirm({
      title: '温馨提示',
      content: '确认删除当前内容？',
      autoFocusButton: null,
      onOk: () => {
        if (params.id) {
          deleteGuide({ id: +params.id }).then((res) => {
            if (res.success) {
              message.success('删除成功');
              location.reload();
            }
          });
        }
      },
      onCancel: () => {},
      okType: 'danger',
    });
  };

  const onEdit = () => history.push(`/guide/edit?id=${params.id}`);

  useEffect(() => {
    if (!params.id) return;
    getData(+params.id);
  }, [params]);

  return (
    <div className={'flex-1 rounded-sm bg-white pb-[80px] text-[#191919]'} key={detail?.id || 'none'}>
      <Spin spinning={loading}>
        {!!detail?.content && (
          <div className={'h-auto'}>
            <div className={'mb-4 flex items-center space-x-2 border-b border-b-zinc-100 py-4'}>
              <h1 className={'g-line-bg-text text-[20px] font-bold md:text-[24px]'}>{detail?.title}</h1>
              <AccessAdmin>
                <span
                  className={'flex cursor-pointer items-center space-x-1 rounded bg-zinc-50 p-1 hover:bg-zinc-100'}
                  onClick={onEdit}
                >
                  <span className={'flex'}>
                    <Editor theme="outline" size="16" fill="#333" />
                  </span>
                  <span className={'leading-none'}>编辑</span>
                </span>
              </AccessAdmin>
              <AccessAdmin>
                <span
                  className={
                    'flex cursor-pointer items-center space-x-1 rounded bg-rose-50 p-1 text-rose-500 hover:bg-rose-100'
                  }
                  onClick={onDel}
                >
                  <span className={'flex'}>
                    <Delete theme="outline" size="16" />
                  </span>
                  <span className={'leading-none'}>删除</span>
                </span>
              </AccessAdmin>
            </div>
            <QuillEditor theme={'snow'} readOnly html={detail.content}></QuillEditor>
          </div>
        )}
        {!loading && !detail?.content && (
          <div className={'flex w-full items-center space-x-2 p-4 text-center text-[16px] text-zinc-400'}>
            <LoudlyCryingFace theme="outline" size={24} />
            <span>内容不存在或已下线...</span>
          </div>
        )}
      </Spin>
      {contextHolder}
    </div>
  );
};
