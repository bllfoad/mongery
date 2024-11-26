import React, { useState, useMemo } from 'react';
import { Table, Modal, Input } from 'antd';
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
      title: 'Müşteri',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Fatura Numarası',
      dataIndex: 'order_number',
      key: 'order_number',
    },
    {
      title: 'Toplam Miktar',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
    {
      title: `Toplam Tutar (${currency})`,
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
    {
      title: `Toplam Maliyet (${currency})`,
      dataIndex: 'cost',
      key: 'cost',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
    {
      title: `Toplam Karlılık (${currency})`,
      dataIndex: 'profit',
      key: 'profit',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
    {
      title: `Net Kar (Cüneyt bey) (${currency})`,
      dataIndex: 'net_profit',
      key: 'net_profit',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
  ];

  const productColumns: ColumnsType<ProductData> = [
    {
      title: 'Ürün',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Fatura Numarası',
      dataIndex: 'invoice_number',
      key: 'invoice_number',
    },
    {
      title: 'Toplam Miktar',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
    {
      title: `Toplam Tutar (${currency})`,
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
    {
      title: `Toplam Maliyet (${currency})`,
      dataIndex: 'cost',
      key: 'cost',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
    {
      title: `Toplam Karlılık (${currency})`,
      dataIndex: 'profit',
      key: 'profit',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
    {
      title: `Net Kar (Cüneyt bey) (${currency})`,
      dataIndex: 'net_profit',
      key: 'net_profit',
      render: (value) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value),
    },
  ];

  return (
    <>
      <Input
        placeholder="Ara..."
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
        title="Ürün Özellikleri"
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
