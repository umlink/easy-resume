import Api from '@/api';
import { createResume, getResumeCount } from '@/api/Resume';
import { getTemplateInfo, getTemplateTags } from '@/api/Template';
import { history } from '@@/core/history';
import { Fire, UpdateRotation } from '@icon-park/react';
import { useRequest, useSetState, useUpdateEffect } from 'ahooks';

type StateType = {
  filters: {
    label: string;
    key: string;
    Icon: any;
  }[];
  activeKey: string;
  templateList: API.TemplateItemVO[];
  templateTags: string[];
  params: {
    code?: string;
    tags?: string[];
    pageNum: number;
    pageSize: number;
  };
  total: number;
  count: number;
  genCode: string;
};

const HomeModel = () => {
  const [homeState, setHomeState] = useSetState<StateType>({
    filters: [
      {
        label: '最新',
        key: 'new',
        Icon: UpdateRotation,
      },
      {
        label: '最热',
        key: 'hot',
        Icon: Fire,
      },
    ],
    activeKey: 'new',
    templateList: [],
    templateTags: [],
    params: {
      code: undefined,
      tags: [],
      pageNum: 1,
      pageSize: 12,
    },
    total: 0,
    count: 0,
    genCode: '',
  });

  const genMyResume = (data: API.TemplateItemVO) => {
    createResume({
      title: data.title,
      templateCode: data.code,
      content: data.content,
    }).then((res) => {
      setHomeState({ genCode: '' });
      if (res.success) {
        history.push(`/editor/${res.data}`);
      }
    });
  };

  const genResumeByCode = (code: string) => {
    setHomeState({ genCode: code });
    getTemplateInfo({ code }).then((res) => {
      if (res.success) {
        genMyResume(res.data);
      } else {
        setHomeState({ genCode: '' });
      }
    });
  };

  const getGenCount = () => {
    getResumeCount().then((res) => {
      if (res.success) {
        setHomeState({ count: res.data });
      }
    });
  };

  const { loading, run: getResumeList } = useRequest(
    async () => {
      const res = await Api.Template.getTemplateList(
        {
          ...homeState.params,
          filter: homeState.activeKey,
        },
        {
          ignoreErrMsg: true,
        },
      );
      if (res.success) {
        setHomeState({
          total: res.data.total,
          templateList: res.data.list,
        });
      }
    },
    {
      manual: true,
    },
  );

  const getTags = () => {
    getTemplateTags().then((res) => {
      if (res.success) {
        setHomeState({ templateTags: res.data });
      }
    });
  };

  useUpdateEffect(() => {
    getResumeList();
  }, [homeState.params, homeState.activeKey]);

  return {
    genResumeByCode,
    homeState,
    setHomeState,
    loading,
    getResumeList,
    getGenCount,
    getTags,
  };
};

export default HomeModel;
