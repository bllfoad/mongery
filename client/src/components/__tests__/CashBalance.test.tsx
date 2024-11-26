import React from 'react';
import { render, getAntStatistic, getAntStatisticTitle, getAntStatisticValue, getAntStatisticSuffix, getAntSpin } from '../../utils/test-utils';
import CashBalance from '../CashBalance';

describe('CashBalance', () => {
  it('renders balance correctly', () => {
    render(
      <CashBalance
        balance={100000}
        currency="USD"
        loading={false}
      />
    );

    const statistic = getAntStatistic();
    expect(statistic).toBeInTheDocument();
    
    const title = getAntStatisticTitle();
    expect(title).toHaveTextContent('Total Cash Balance');
    
    const value = getAntStatisticValue();
    expect(value).toHaveTextContent('100,000.00');
    
    const suffix = getAntStatisticSuffix();
    expect(suffix).toHaveTextContent('USD');
  });

  it('displays positive balance in green', () => {
    render(
      <CashBalance
        balance={100000}
        currency="USD"
        loading={false}
      />
    );

    const statistic = getAntStatistic();
    const valueContainer = statistic?.querySelector('.ant-statistic-content');
    expect(valueContainer).toHaveStyle({ color: '#3f8600' });
  });

  it('displays negative balance in red', () => {
    render(
      <CashBalance
        balance={-1000}
        currency="USD"
        loading={false}
      />
    );

    const statistic = getAntStatistic();
    const valueContainer = statistic?.querySelector('.ant-statistic-content');
    expect(valueContainer).toHaveStyle({ color: '#cf1322' });
  });

  it('displays loading state', () => {
    render(
      <CashBalance
        balance={0}
        currency="USD"
        loading={true}
      />
    );

    const statistic = getAntStatistic();
    expect(statistic).toBeInTheDocument();
    
    // When loading is true, Ant Design's Statistic shows a loading placeholder
    const loadingPlaceholder = document.querySelector('.ant-skeleton');
    expect(loadingPlaceholder).toBeInTheDocument();
  });

  it('handles zero balance', () => {
    render(
      <CashBalance
        balance={0}
        currency="USD"
        loading={false}
      />
    );

    const value = getAntStatisticValue();
    expect(value).toHaveTextContent('0.00');
    
    const statistic = getAntStatistic();
    const valueContainer = statistic?.querySelector('.ant-statistic-content');
    expect(valueContainer).toHaveStyle({ color: '#3f8600' });
  });

  it('handles different currencies', () => {
    render(
      <CashBalance
        balance={1000}
        currency="TRY"
        loading={false}
      />
    );

    const value = getAntStatisticValue();
    expect(value).toHaveTextContent('1,000.00');
    
    const suffix = getAntStatisticSuffix();
    expect(suffix).toHaveTextContent('TRY');
  });
});
