import { Table } from 'antd';
import type { TableProps } from 'antd';
import dataList from '@/constants/invite-website-dasta';

interface DataType {
  name: string;
  url: string;
  schoolUrl?: string;
  desc?: string;
}

export default () => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 220,
    },
    {
      title: '官网地址',
      dataIndex: 'url',
      ellipsis: true,
      render: (text) => (
        <a href={text} target={'_blank'} rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: '校园招聘',
      dataIndex: 'schoolUrl',
      ellipsis: true,
      render: (text) => (
        <a href={text} target={'_blank'} rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: '简介',
      dataIndex: 'desc',
      width: 200,
      ellipsis: true,
    },
  ];

  return (
    <div>
      <Table size={'small'} pagination={false} columns={columns} dataSource={dataList} bordered />
    </div>
  );
};
