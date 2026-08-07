import PayDesc from '@/components/VipContainer/PayDesc';
import { Typography } from 'antd';
import VipDesc from '@/components/VipContainer/VipDesc';
const { Title, Paragraph, Text } = Typography;

export default () => {
  return (
    <>
      <Title level={3}>权益说明</Title>
      <Paragraph>
        <ol className={'space-y-2'}>
          <li>
            新注册用户<Text type="warning">免费赠送一天体验会员</Text>
            ，会员到期后可自行选择是否继续使用，提供人性化选择。
          </li>
          <li>只要购买会员，所有权益功能不分等级，只有时间限制。</li>
          <li>
            不提供按次付费模式，会员到期前<Text code>编辑</Text>、<Text code>导出</Text>、<Text code>预览</Text>等全部
            <Text type="warning">不受限</Text>。
          </li>
          <li>简历在线预览和在线授权查看功能不受非会员影响。</li>
          <li>
            考虑到正常使用场景，所有用户新增简历数最多为 <Text code>10</Text> 份。
          </li>
          <li>
            简历编辑完成后，可在微信小程序「职书小纪」中下载/预览<Text code>PDF</Text>，可一键转发
            <Text code>PDF</Text>。
          </li>
          <li className={'underline underline-offset-2'}>
            特殊说明：
            <Text type="warning">
              <b>AI</b>
            </Text>
            优化为附赠权益，内容优化额度和简历检测次数用完后，可通过会员续费继续使用
            <Text type="warning">
              <b>AI</b>
            </Text>
            功能
          </li>
        </ol>
      </Paragraph>
      <Title level={3}>会员说明</Title>
      <blockquote>
        <VipDesc />
      </blockquote>
      <PayDesc />
    </>
  );
};
