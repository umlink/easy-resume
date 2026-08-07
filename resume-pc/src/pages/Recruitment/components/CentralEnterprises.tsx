import { Table } from 'antd';
import type { TableProps } from 'antd';
import dataList from '@/constants/central-enterprisers-data';

interface DataType {
  companyName: string;
  bkLink: string;
  url: string;
}

export default () => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      width: 220,
    },
    {
      title: '百度百科',
      dataIndex: 'bkLink',
      width: 150,
      align: 'center',
      ellipsis: true,
      render: (text) => (
        <a href={text} target={'_blank'} rel="noreferrer">
          百度百科
        </a>
      ),
    },
    {
      title: '相关招聘网址',
      dataIndex: 'url',
      ellipsis: true,
      render: (text) => (
        <a href={text} target={'_blank'} rel="noreferrer">
          {text}
        </a>
      ),
    },
  ];

  return (
    <div>
      <Table size={'small'} pagination={false} columns={columns} dataSource={dataList} bordered />
    </div>
  );
};
