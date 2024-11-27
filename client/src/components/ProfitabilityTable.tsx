import React, { useState, useMemo } from 'react';
import { Table, Modal, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';

interface OrderData {
  key: string;
  order_number: string;
  order_date: string;
  customer: string;
  total_quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  net_profit: number;
}

interface ProductData {
  key: string;
  product_name: string;
  invoice_number: string;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  net_profit: number;
  attributes: {
    Paket: string;
    Sarım: string;
    'İç Çap': string;
    'Dış Çap': string;
    'Tel Çapı': string;
    'Zn Kaplama': string;
    'Sarım Türü': string;
    'Çap Toleransları': string;
    'Mukavemet (Min-Max)': string;
  };
  unit?: string;
}

type TableData = OrderData | ProductData;

interface ProfitabilityTableProps {
  data: any[];
  loading: boolean;
  type: 'order' | 'product';
  currency: string;
}

const ProfitabilityTable: React.FC<ProfitabilityTableProps> = ({
  data,
  loading,
  type,
  currency,
}) => {
  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState<ProductData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    
    return data.filter((item: any) => {
      if (type === 'order') {
        return (
          item.customer?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.order_number?.toLowerCase().includes(searchText.toLowerCase())
        );
      } else {
        return (
          item.product_name?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.invoice_number?.toLowerCase().includes(searchText.toLowerCase())
        );
      }
    });
  }, [data, searchText, type]);

  const showSpecifications = (record: ProductData) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRow(null);
  };

  const orderColumns: ColumnsType<OrderData> = [
    {
      title: t('table.customer'),
      dataIndex: 'customer',
      key: 'customer',
      render: (value) => (
        <div
          style={{
            backgroundColor: 'rgba(250, 219, 20, 0.2)',
            color: '#d4b106',
            border: '1px solid #d4b106',
            borderRadius: '4px',
            padding: '2px 4px',
            fontSize: '10px',
            display: 'inline-block',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }}
        >
          {value}
        </div>
      ),
    },
    {
      title: t('table.orderNumber'),
      dataIndex: 'order_number',
      key: 'order_number',
    },
    {
      title: t('table.orderDate'),
      dataIndex: 'order_date',
      key: 'order_date',
    },
    {
      title: t('table.totalQuantity'),
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      render: (value) => `${value}`,
    },
    {
      title: `${t('table.revenue')} (${currency})`,
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => {
        const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        return (
          <div
            style={{
              backgroundColor: value >= 0 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)',
              color: value >= 0 ? '#52c41a' : '#f5222d',
              border: `1px solid ${value >= 0 ? '#52c41a' : '#f5222d'}`,
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '10px',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}
          >
            {`${currency} ${formattedValue}`}
          </div>
        );
      },
    },
    {
      title: `${t('table.cost')} (${currency})`,
      dataIndex: 'cost',
      key: 'cost',
      render: (value) => {
        const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        return (
          <div
            style={{
              backgroundColor: value >= 0 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)',
              color: value >= 0 ? '#52c41a' : '#f5222d',
              border: `1px solid ${value >= 0 ? '#52c41a' : '#f5222d'}`,
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '10px',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}
          >
            {`${currency} ${formattedValue}`}
          </div>
        );
      },
    },
    {
      title: `${t('table.profit')} (${currency})`,
      dataIndex: 'profit',
      key: 'profit',
      render: (value) => {
        const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        return (
          <div
            style={{
              backgroundColor: value >= 0 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)',
              color: value >= 0 ? '#52c41a' : '#f5222d',
              border: `1px solid ${value >= 0 ? '#52c41a' : '#f5222d'}`,
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '10px',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}
          >
            {`${currency} ${formattedValue}`}
          </div>
        );
      },
    },
    {
      title: `${t('table.netProfit')} (${currency})`,
      dataIndex: 'net_profit',
      key: 'net_profit',
      render: (value) => {
        const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        return (
          <div
            style={{
              backgroundColor: value >= 0 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)',
              color: value >= 0 ? '#52c41a' : '#f5222d',
              border: `1px solid ${value >= 0 ? '#52c41a' : '#f5222d'}`,
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '10px',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}
          >
            {`${currency} ${formattedValue}`}
          </div>
        );
      },
    },
  ];

  const productColumns: ColumnsType<ProductData> = [
    {
      title: t('table.productName'),
      dataIndex: 'product_name',
      key: 'product_name',
      render: (value) => (
        <div
          style={{
            backgroundColor: 'rgba(114, 46, 209, 0.2)',
            color: '#722ed1',
            border: '1px solid #722ed1',
            borderRadius: '4px',
            padding: '2px 4px',
            fontSize: '10px',
            display: 'inline-block',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }}
        >
          {value}
        </div>
      ),
    },
    {
      title: t('table.invoiceNumber'),
      dataIndex: 'invoice_number',
      key: 'invoice_number',
    },
    {
      title: t('table.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value, record: ProductData) => `${value} ${record.unit || 'pcs'}`,
    },
    {
      title: `${t('table.revenue')} (${currency})`,
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => {
        const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        return (
          <div
            style={{
              backgroundColor: value >= 0 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)',
              color: value >= 0 ? '#52c41a' : '#f5222d',
              border: `1px solid ${value >= 0 ? '#52c41a' : '#f5222d'}`,
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '10px',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}
          >
            {`${currency} ${formattedValue}`}
          </div>
        );
      },
    },
    {
      title: `${t('table.cost')} (${currency})`,
      dataIndex: 'cost',
      key: 'cost',
      render: (value) => {
        const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        return (
          <div
            style={{
              backgroundColor: value >= 0 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)',
              color: value >= 0 ? '#52c41a' : '#f5222d',
              border: `1px solid ${value >= 0 ? '#52c41a' : '#f5222d'}`,
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '10px',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}
          >
            {`${currency} ${formattedValue}`}
          </div>
        );
      },
    },
    {
      title: `${t('table.profit')} (${currency})`,
      dataIndex: 'profit',
      key: 'profit',
      render: (value) => {
        const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        return (
          <div
            style={{
              backgroundColor: value >= 0 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)',
              color: value >= 0 ? '#52c41a' : '#f5222d',
              border: `1px solid ${value >= 0 ? '#52c41a' : '#f5222d'}`,
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '10px',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}
          >
            {`${currency} ${formattedValue}`}
          </div>
        );
      },
    },
    {
      title: `${t('table.netProfit')} (${currency})`,
      dataIndex: 'net_profit',
      key: 'net_profit',
      render: (value) => {
        const formattedValue = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        return (
          <div
            style={{
              backgroundColor: value >= 0 ? 'rgba(82, 196, 26, 0.1)' : 'rgba(245, 34, 45, 0.1)',
              color: value >= 0 ? '#52c41a' : '#f5222d',
              border: `1px solid ${value >= 0 ? '#52c41a' : '#f5222d'}`,
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '10px',
              display: 'inline-block',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}
          >
            {`${currency} ${formattedValue}`}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Input
        placeholder={t('search.placeholder')}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: '100%', marginBottom: 16 }}
      />
      {type === 'order' ? (
        <Table<OrderData>
          columns={orderColumns}
          dataSource={filteredData.map((item, index) => ({ ...item, key: index.toString() })) as OrderData[]}
          loading={loading}
          pagination={false}
        />
      ) : (
        <Table<ProductData>
          columns={productColumns}
          dataSource={filteredData.map((item, index) => ({ ...item, key: index.toString() })) as ProductData[]}
          loading={loading}
          pagination={false}
          onRow={(record) => ({
            onClick: () => showSpecifications(record),
            style: { cursor: 'pointer' },
          })}
        />
      )}
      <Modal
        title={t('modal.title')}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedRow && (
          <div>
            {Object.entries(selectedRow.attributes).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ProfitabilityTable;
