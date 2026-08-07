import { getResumeTmpInfo } from '@/api/Resume';
import { getResumeGroupList } from '@/api/ResumeGroup';
import { getResumeTemplate } from '@/constants/template-data';
import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';
import { useSetState, useUpdateEffect } from 'ahooks';

type DateStateType = {
  readOnly: boolean;
  loading: boolean;
  activeType: number;
  activeGroup: number;
  groupKey: string;
  groupList: API.ResumeGroupItem[];
  resumeData: IResumeData;
};
const DataModel = () => {
  const [state, setState] = useSetState<DateStateType>({
    readOnly: false,
    loading: false,
    activeType: 0,
    groupList: [],
    groupKey: '',
    activeGroup: 0,
    resumeData: getResumeTemplate(),
  });

  const getResumeDetail = (id: number) => {
    setState({ loading: true });
    getResumeTmpInfo({ id }).then((res) => {
      setState({ loading: false });
      if (res.success) {
        const data = {
          ...res.data,
          ...(res.data.content as any),
        } as IResumeData;
        setState({ resumeData: data });
      }
    });
  };

  const updateType = (index: number, id: number) => {
    setState({ activeType: index });
    getResumeDetail(id);
  };

  const getResumeInfo = () => {
    state.groupList.forEach((item, index) => {
      if (item.key === state.groupKey) {
        setState({ activeGroup: index, activeType: 0 });
        getResumeDetail(state.groupList[index].types[0].resumeId);
      }
    });
  };

  const getGroupList = () => {
    setState({ loading: true });
    getResumeGroupList().then((res) => {
      if (res.success) {
        const groupList = res.data;
        setState({ groupList });
      }
      setState({ loading: false });
    });
  };

  useUpdateEffect(getResumeInfo, [state.groupKey, state.groupList]);

  return { state, setState, getGroupList, updateType, getResumeDetail };
};

export default DataModel;
