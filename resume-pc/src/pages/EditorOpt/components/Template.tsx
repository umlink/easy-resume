import { getTemplateList, getTemplateTags } from '@/api/Template';
import { ResumeDataContext } from '@/context';
import { Search, Theme } from '@icon-park/react';
import { useSetState, useUpdateEffect } from 'ahooks';
import { Button, Drawer, Input, Pagination, Tooltip } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import TemplateItem from './TemplateItem';

type StateType = {
  pageNum: number;
  pageSize: number;
  total: number;
  templateCode: string;
  templateList: API.TemplateItemVO[];
  templateTags: string[];
};
export default (props: { children?: JSX.Element }) => {
  const { resumeData } = useContext(ResumeDataContext);
  const [showTemplate, setShowTemplate] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [state, setState] = useSetState<StateType>({
    pageNum: 1,
    pageSize: 100,
    total: 0,
    templateCode: '',
    templateList: [],
    templateTags: [],
  });

  const onSelectTag = (tag: string) => {
    let tags = [];
    if (!selectedTags.includes(tag)) {
      tags.push(tag);
    }
    setSelectedTags(tags);
  };

  const getTags = () => {
    getTemplateTags().then((res) => {
      if (res.success) {
        setState({ templateTags: res.data });
      }
    });
  };

  const getTemplateData = () => {
    getTemplateList({
      pageNum: state.pageNum,
      pageSize: state.pageSize,
      code: state.templateCode,
      tags: selectedTags,
      filter: 'new',
    }).then((res) => {
      if (res.success) {
        const data = res.data;
        setState({
          total: data.total,
          templateList: data.list,
        });
      }
    });
  };

  useUpdateEffect(() => {
    getTemplateData();
  }, [state.pageNum, state.pageSize, selectedTags]);

  const onPaginationChange = (page: number, pageSize: number) => {
    setState({
      pageNum: page,
      pageSize: pageSize,
    });
  };

  useEffect(() => {
    getTemplateData();
    getTags();
  }, [showTemplate]);

  return (
    <div className={'py-3'}>
      {!!props.children ? (
        <span onClick={() => setShowTemplate(!showTemplate)}>{props.children}</span>
      ) : (
        <div className={'flex items-center justify-between'}>
          <span className={'g-line-before-title'}>模板切换</span>
          <Tooltip title="切换简历模板" placement={'top'}>
            <Button
              size={'small'}
              style={{ width: 106 }}
              icon={<Theme theme={'filled'} size={14} fill={'#c026d3'} />}
              onClick={() => setShowTemplate(true)}
            >
              <span className={'g-line-bg-text'}>{resumeData.templateCode}</span>
            </Button>
          </Tooltip>
        </div>
      )}
      <Drawer
        closable={false}
        title={
          <div className={'flex items-center space-x-5'}>
            <Input
              variant={'filled'}
              value={state.templateCode}
              placeholder={'根据简历编号查询'}
              className={'max-w-[220px]'}
              onChange={(e: any) => setState({ templateCode: e.target.value })}
              onPressEnter={getTemplateData}
              suffix={
                <span className={'cursor-pointer'} onClick={getTemplateData}>
                  <Search />
                </span>
              }
            />
            <div className={'space-x-3'}>
              {state.templateTags.map((tag) => {
                return (
                  <span
                    key={tag}
                    className={`border-1 cursor-pointer select-none space-x-1
                    rounded border border-zinc-100 bg-zinc-50 px-3
                    py-1.5 text-[14px] font-normal
                    ${selectedTags.includes(tag) ? 'g-line-bg-text' : ''}
                    hover:bg-zinc-100`}
                    onClick={() => onSelectTag(tag)}
                  >
                    #&nbsp;{tag}
                  </span>
                );
              })}
            </div>
            <div className={'flex-1'}>
              {state.total > state.pageSize && (
                <Pagination
                  showSizeChanger
                  showQuickJumper
                  current={state.pageNum}
                  pageSize={state.pageSize}
                  pageSizeOptions={[12, 24, 48, 96]}
                  align="end"
                  showTotal={(total) => `总数：${total} `}
                  defaultCurrent={1}
                  total={state.total}
                  onChange={onPaginationChange}
                />
              )}
            </div>
          </div>
        }
        placement={'bottom'}
        height={'90%'}
        width={'100%'}
        styles={{ body: { padding: 0 } }}
        onClose={() => setShowTemplate(false)}
        open={showTemplate}
      >
        <div
          className={`grid grid-cols-2 gap-2 overflow-y-auto p-6 pt-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`}
        >
          {state.templateList.map((data) => {
            return <TemplateItem key={data.id} item={data} onClose={() => setShowTemplate(false)} />;
          })}
        </div>
      </Drawer>
    </div>
  );
};
