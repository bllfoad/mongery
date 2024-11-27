import React, { useState } from 'react';
import { Layout, Radio, Select, Space, Typography } from 'antd';
import { profitabilityApi } from './store/api';
import ProfitabilityTable from './components/ProfitabilityTable';
import CashBalance from './components/CashBalance';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState<'order' | 'product'>('order');
  const [currency, setCurrency] = useState<string>('USD');

  const { data: orderData, isLoading: orderLoading } = profitabilityApi.useGetOrderProfitabilityQuery(currency);
  const { data: productData, isLoading: productLoading } = profitabilityApi.useGetProductProfitabilityQuery(currency);
  const { data: balanceData, isLoading: balanceLoading } = profitabilityApi.useGetCashBalanceQuery(currency);

  return (
    <ThemeProvider>
      <Layout className="min-h-screen">
        <Header className="shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <Title level={3} className="m-0">{t('dashboard.title')}</Title>
            <Space size="middle">
              <Radio.Group 
                value={viewType} 
                onChange={(e) => setViewType(e.target.value)}
              >
                <Radio.Button value="order">{t('dashboard.viewTypes.byOrder')}</Radio.Button>
                <Radio.Button value="product">{t('dashboard.viewTypes.byProduct')}</Radio.Button>
              </Radio.Group>
              <Select
                value={currency}
                onChange={setCurrency}
                options={[
                  { value: 'USD', label: 'USD' },
                  { value: 'TL', label: 'TL' },
                ]}
                className="min-w-[80px]"
              />
              <LanguageSwitcher />
              <ThemeToggle />
            </Space>
          </div>
        </Header>
        <Content className="container mx-auto p-4 flex-1">
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
    </ThemeProvider>
  );
};

export default App;
