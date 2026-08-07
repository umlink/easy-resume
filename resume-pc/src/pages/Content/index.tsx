import { ResumeDataContext } from '@/context';
import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';
import TemplateDir from '@/pages/TemplateDir';
import { getHexColorByAlpha, reversalColor } from '@/utils/tools';
import { useModel, useParams } from '@umijs/max';
import { Spin } from 'antd';
import { useEffect } from 'react';
import Group from './components/Group';
import TypesAction from './components/TypesAction';

export default () => {
  const params = useParams();
  const { state, setState, getGroupList } = useModel('Content.model');
  const updateResumeData = (v: IResumeData) => {
    setState({ resumeData: v });
  };

  const ResumeTemplate = TemplateDir[state.resumeData?.templateCode] || <span>null</span>;

  const tempColor = reversalColor(state.resumeData?.content.config.themeColor);

  useEffect(() => {
    getGroupList();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.groupKey, state.resumeData.id]);

  useEffect(() => {
    setState({ groupKey: params.key as string });
  }, [params]);

  if (!state.resumeData.id) {
    return (
      <div className={'w-full p-10 text-center'}>
        <Spin spinning={true} />
      </div>
    );
  }

  return (
    <ResumeDataContext.Provider
      value={{
        resumeData: state.resumeData,
        readOnly: true,
        updateResume: updateResumeData,
        contrastColor: tempColor?.contrastColor,
      }}
    >
      <div className={'flex w-full justify-between pb-10 lg:space-x-5'}>
        <Group />
        <div className={'flex-1'} key={state.resumeData.id}>
          <Spin spinning={state.loading}>
            <div
              style={{ borderColor: getHexColorByAlpha(state.resumeData.content.config.themeColor, 0.4) }}
              className={'w-full rounded-xl border border-dashed'}
            >
              <ResumeTemplate />
            </div>
          </Spin>
        </div>
        <TypesAction />
      </div>
    </ResumeDataContext.Provider>
  );
};
