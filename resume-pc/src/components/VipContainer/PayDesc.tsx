import { Alert } from 'antd';

export default () => {
  return (
    <Alert
      message="温馨提示：【内容优化】指简历其中一个模块的优化，单次优化消耗 tokens 计算方式约为内容长度 x 1.5，即 100～1000左右。"
      type="warning"
    />
  );
};
