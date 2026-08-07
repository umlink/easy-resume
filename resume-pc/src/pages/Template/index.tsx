import EmptyListSVG from '@/assets/common/empty-list.svg';
import { useModel } from '@umijs/max';
import { Affix, Pagination, Spin } from 'antd';
import React, { useEffect } from 'react';
import Filters from './components/Filters';
import TemplateItem from './components/TemplateItem';

export default () => {
  const { loading, homeState, setHomeState, getResumeList, getGenCount, getTags } = useModel('Template.model');

  const onPaginationChange = (page: number, pageSize: number) => {
    setHomeState({
      params: {
        ...homeState.params,
        pageNum: page,
        pageSize: pageSize,
      },
    });
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getResumeList();
    getGenCount();
    getTags();
  }, []);

  return (
    <div className={'relative mx-auto w-full space-y-4 pb-10'}>
      <Filters />
      <Spin spinning={loading}>
        {!homeState.templateList.length && (
          <div className={'min-h-[700px] pt-[100px]'}>
            <img className={'mx-auto w-[400px]'} src={EmptyListSVG} alt="" />
          </div>
        )}
        <div className={'!mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'}>
          {homeState.templateList.map((item) => {
            return <TemplateItem key={item.id} item={item} />;
          })}
        </div>
      </Spin>
      <Affix offsetBottom={8}>
        <Pagination
          showSizeChanger
          current={homeState.params.pageNum}
          pageSize={homeState.params.pageSize}
          className={'rounded bg-gray-50/70 !py-2'}
          pageSizeOptions={[12, 24, 48, 96]}
          align="center"
          showTotal={(total) => `总数：${total} `}
          defaultCurrent={1}
          total={homeState.total}
          onChange={onPaginationChange}
        />
      </Affix>
    </div>
  );
};
