import { LeftTwo } from '@icon-park/react';
import { useModel } from '@umijs/max';
import { Button } from 'antd';

export default () => {
  const { state, updateType } = useModel('Content.model');
  return (
    <div className={'flex flex-col space-y-2 rounded-xl bg-zinc-50 md:bg-zinc-50/50'}>
      {state.groupList[state.activeGroup]?.types?.map((item: any, ti: number) => {
        return (
          <Button
            key={ti}
            className={'text-zinc-400'}
            type={'text'}
            onClick={() => updateType(ti, item.resumeId)}
            icon={
              ti === state.activeType ? (
                <span className={'text-pink-500'}>
                  <LeftTwo theme={'filled'} />
                </span>
              ) : (
                <span className={'flex w-[14px]'}></span>
              )
            }
          >
            {ti === state.activeType ? <span className={'g-line-bg-text font-extrabold'}>{item.type}</span> : item.type}
          </Button>
        );
      })}
    </div>
  );
};
