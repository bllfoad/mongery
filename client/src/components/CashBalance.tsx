import React from 'react';
import { Card, Statistic } from 'antd';

interface CashBalanceProps {
  balance: number;
  currency: string;
  loading: boolean;
}

const CashBalance: React.FC<CashBalanceProps> = ({ balance, currency, loading }) => {
  return (
    <Card className="w-full md:w-96 shadow-lg">
      <Statistic
        title="Total Cash Balance"
        value={balance}
        precision={2}
        suffix={currency}
        loading={loading}
        valueStyle={{ color: balance >= 0 ? '#3f8600' : '#cf1322' }}
      />
    </Card>
  );
};

export default CashBalance;
