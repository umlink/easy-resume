import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import CentralEnterprises from '@/pages/Recruitment/components/CentralEnterprises';
import Provincial from '@/pages/Recruitment/components/Provincial';
import InviteWebsite from '@/pages/Recruitment/components/InviteWebsite';

export default () => {
  const tabItems: TabsProps['items'] = [
    {
      key: 'InviteWebsite',
      label: '各招聘官网',
      children: <InviteWebsite />,
    },
    {
      key: 'Central',
      label: '央企招聘',
      children: <CentralEnterprises />,
    },
    {
      key: 'Provincial',
      label: '各省招聘',
      children: <Provincial />,
    },
  ];
  return (
    <div className={'mb-[80px] px-3 lg:pb-0'}>
      <Tabs defaultActiveKey="InviteWebsite" items={tabItems} />
    </div>
  );
};
