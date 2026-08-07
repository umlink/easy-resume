import { Table } from 'antd';
import type { TableProps } from 'antd';
import dataList from '@/constants/provincial-data';

interface DataType {
  province: string;
  authorityUrl: string;
  placeName: string;
  placeUrl: string;
}

export default () => {
  const columns: TableProps<DataType>['columns'] = [
    {
      title: '省/直辖市',
      dataIndex: 'province',
      width: 220,
    },
    {
      title: '官方',
      dataIndex: 'authorityUrl',
      ellipsis: true,
      render: (text) => (
        <a href={text} target={'_blank'} rel="noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: '地方名',
      dataIndex: 'placeName',
      width: 150,
    },
    {
      title: '地方招聘地址',
      dataIndex: 'placeUrl',
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
