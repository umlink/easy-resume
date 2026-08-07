import { createGuide, deleteGuide, getGuideDetail, updateGuide } from '@/api/Guide';
import QuillEditor from '@/components/QuillEditor';
import useQueryParams from '@/hooks/useQueryParams';
import { useRequest } from '@umijs/max';
import { useSetState } from 'ahooks';
import { Affix, Button, Input, message, Spin, Popconfirm } from 'antd';
import { useEffect } from 'react';
import GuideDraft from './components/Draft';

export default () => {
  const [query, setQuery, replaceQuery] = useQueryParams();
  const [state, setState] = useSetState({
    id: 0,
    title: '',
    content: '',
    status: -1,
    sort: 1,
  });
  const { run: getData, loading } = useRequest(
    () =>
      getGuideDetail({ id: +query.id }).then((res) => {
        if (res.success) {
          setState(res.data);
        }
      }),
    {
      manual: true,
    },
  );
  const onDelDraft = () => {
    deleteGuide({ id: query.id }).then((res) => {
      if (res.success) {
        message.success('删除成功');
        replaceQuery({ id: null });
        location.reload();
      }
    });
  };
  const onSubmit = (params: { status: number }) => {
    if (!state.title || !state.content) return;
    if (state.id) {
      updateGuide({ ...state, id: +query.id, ...params }).then((res) => {
        if (res.success) {
          message.success('更新成功');
        }
      });
      return;
    }
    createGuide({
      ...state,
      ...params,
    }).then((res) => {
      if (res.success) {
        setQuery({ id: res.data });
        message.success('操作成功');
      }
    });
  };
  useEffect(() => {
    if (query.id) {
      getData();
    }
  }, [query]);

  const showEditor = !query.id || (!!query.id && !!state.content);

  return (
    <div className={'z-10 flex-1 rounded-sm bg-white pb-[100px] pt-1'}>
      <div className={'mb-2 border-b border-b-zinc-100'}>
        <Input
          className={'!px-0 !text-[22px] font-bold'}
          value={state.title}
          onChange={(e) => setState({ title: e.target.value })}
          variant={'borderless'}
          size={'large'}
          placeholder={'标题'}
        />
      </div>
      <Spin spinning={loading}>
        {showEditor && (
          <QuillEditor
            key={query.id || 'editor'}
            html={state.content}
            readOnly={false}
            onChange={(val) => setState({ content: val })}
          />
        )}
      </Spin>
      <Affix offsetBottom={20}>
        <div className={'flex items-center justify-end space-x-3 bg-zinc-100/80 p-2 shadow-sm'}>
          <GuideDraft onSelect={(item) => setQuery({ id: item.id })} />
          {state.status === 0 && (
            <Popconfirm
              title="删除当前草稿"
              description="确认要删除当前草稿"
              onConfirm={onDelDraft}
              okText="确认删除"
              cancelText="取消"
            >
              <Button>删除草稿</Button>
            </Popconfirm>
          )}
          <Button onClick={() => onSubmit({ status: 0 })}>保存草稿</Button>
          <Button type={'primary'} onClick={() => onSubmit({ status: 1 })}>
            发布
          </Button>
        </div>
      </Affix>
    </div>
  );
};
