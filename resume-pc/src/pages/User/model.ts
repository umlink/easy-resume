import { copyResume, getResumeList, removeResume, updateResume } from '@/api/Resume';
import { ROLES_ENUMS } from '@/constants/enums';
import { history, useModel } from '@umijs/max';
import { useSetState } from 'ahooks';
import { message } from 'antd';
import copy from 'copy-to-clipboard';

type StateType = {
  isEdit: boolean;
  loading: boolean;
  resumeList: API.ResumeItemVO[];
};

const useMine = () => {
  const { initialState } = useModel('@@initialState');
  const [state, setState] = useSetState<StateType>({
    loading: false,
    isEdit: false,
    resumeList: [],
  });
  const getResumeData = () => {
    if (state.loading) return;
    setState({ loading: true });
    getResumeList({
      pageNum: 1,
      pageSize: initialState?.roles?.includes(ROLES_ENUMS.SUPER_ADMIN) ? 100 : 10,
    })
      .then((res) => {
        if (res.success) {
          setState({ resumeList: res.data?.list || [] });
        }
      })
      .finally(() => setState({ loading: false }));
  };

  const onDelResume = (item: API.ResumeItemVO, index: number) => {
    removeResume({ id: item.id }).then((res) => {
      if (res.success) {
        state.resumeList.splice(index, 1);
        setState({ resumeList: [...state.resumeList] });
        message.success('删除成功');
      }
    });
  };

  const onCopyResume = (id: number) => {
    copyResume({ id }).then((res) => {
      if (res.success) {
        history.push(`/editor/${res.data}`);
      }
    });
  };

  const updateResumeAccessCode = (id: number, share: boolean) => {
    const accessCode = share ? Math.random().toString().slice(2, 10) : '';
    updateResume({ id, accessCode }).then((res) => {
      if (res.success) {
        getResumeData();
        if (share) {
          copy(`${location.origin}/preview/${id}?code=${accessCode}`);
          return message.success('设置成功，分享地址已复制到粘贴板');
        }
        message.success('设置成功');
      }
    });
  };

  return {
    state,
    setState,
    getResumeData,
    onDelResume,
    onCopyResume,
    updateResumeAccessCode,
  };
};

export default useMine;
