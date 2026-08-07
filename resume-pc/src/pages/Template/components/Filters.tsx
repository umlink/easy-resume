import { Search } from '@icon-park/react';
import { useModel } from '@umijs/max';
import { Button, Input } from 'antd';
import { useState } from 'react';

export default () => {
  const { homeState, setHomeState } = useModel('Template.model');
  const [selectedTags, setSelectedTags] = useState<string[]>(['']);
  const [code, setCode] = useState();
  const updateCodeParams = () => {
    setHomeState({
      params: {
        ...homeState.params,
        pageNum: 1,
        code,
      },
    });
  };
  const onSelectTag = (tag: string) => {
    let tags = [];
    if (!selectedTags.includes(tag)) {
      tags.push(tag);
    }
    setSelectedTags(tags);
    setHomeState({
      params: {
        ...homeState.params,
        pageNum: 1,
        tags,
      },
    });
  };
  return (
    <div className={'space-y-4'}>
      <div className={'flex select-none items-center justify-between space-x-4 rounded'}>
        <div className={'flex flex-1 select-none items-center space-x-3'}>
          {homeState.filters.map(({ key, Icon, label }) => {
            return (
              <Button
                key={key}
                type={homeState.activeKey === key ? 'primary' : 'default'}
                icon={<Icon />}
                onClick={() => setHomeState({ activeKey: key })}
              >
                {label}
              </Button>
            );
          })}
          <Input
            variant={'filled'}
            value={code}
            placeholder={'根据简历编号查询'}
            className={'!hidden max-w-[180px] md:!flex'}
            onChange={(e: any) => setCode(e.target.value)}
            onPressEnter={updateCodeParams}
            suffix={
              <span className={'cursor-pointer'} onClick={updateCodeParams}>
                <Search />
              </span>
            }
          ></Input>
        </div>
        <p className={'hidden whitespace-nowrap text-right font-light text-zinc-800 md:block'}>
          累计生成<b className={'g-line-bg-text px-1 font-semibold'}>{homeState.count}</b>份简历
        </p>
      </div>
      <div className={'md:space-x-2'}>
        {homeState.templateTags.map((tag) => {
          return (
            <span
              key={tag}
              className={`
              mb-2 mr-2
              inline-block
              cursor-pointer
              select-none
              space-x-[2px]
              whitespace-nowrap
              px-2 py-1 text-zinc-500 md:m-0
              ${selectedTags.includes(tag) ? '!bg-primary-50/30' : ''}
              hover:bg-primary-50/30`}
              onClick={() => onSelectTag(tag)}
            >
              <span className={`${selectedTags.includes(tag) ? 'g-line-bg-text font-extrabold' : ''}`}>
                #&nbsp;{tag}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
