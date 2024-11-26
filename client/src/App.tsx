import React, { useState } from 'react';
import { Layout, Radio, Select, Space, Typography } from 'antd';
import { profitabilityApi } from './store/api';
import ProfitabilityTable from './components/ProfitabilityTable';
import CashBalance from './components/CashBalance';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [viewType, setViewType] = useState<'order' | 'product'>('order');
  const [currency, setCurrency] = useState<string>('USD');

  const { data: orderData, isLoading: orderLoading } = profitabilityApi.useGetOrderProfitabilityQuery(currency);
  const { data: productData, isLoading: productLoading } = profitabilityApi.useGetProductProfitabilityQuery(currency);
  const { data: balanceData, isLoading: balanceLoading } = profitabilityApi.useGetCashBalanceQuery(currency);

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Title level={3} className="m-0">Mongery Profitability Dashboard</Title>
          <Space>
            <Radio.Group value={viewType} onChange={(e) => setViewType(e.target.value)}>
              <Radio.Button value="order">By Order</Radio.Button>
              <Radio.Button value="product">By Product</Radio.Button>
            </Radio.Group>
            <Select
              value={currency}
              onChange={setCurrency}
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'TL', label: 'TL' },
              ]}
            />
          </Space>
        </div>
      </Header>
      <Content className="container mx-auto p-4">
        <div className="mb-8">
          <CashBalance
            balance={balanceData?.balance || 0}
            currency={currency}
            loading={balanceLoading}
          />
        </div>
        <ProfitabilityTable
          data={viewType === 'order' ? orderData || [] : productData || []}
          loading={viewType === 'order' ? orderLoading : productLoading}
          type={viewType}
          currency={currency}
        />
      </Content>
    </Layout>
  );
};

export default App;