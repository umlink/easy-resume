import { Spin } from 'antd';

export default () => {
  return (
    <div className={'space-y-4'}>
      <Spin spinning={true}>
        <div className={'min-h-[300px] w-full'}></div>
      </Spin>
    </div>
  );
};
