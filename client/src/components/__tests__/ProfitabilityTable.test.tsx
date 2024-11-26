import React from 'react';
import { render, screen, getAntTable, getAntTableHeaders, getAntTableRows, getAntSpin, createMockOrder, createMockProduct, cleanup } from '../../utils/test-utils';
import ProfitabilityTable from '../ProfitabilityTable';

// Cleanup after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe('ProfitabilityTable', () => {
  const mockOrderData = [createMockOrder()];
  const mockProductData = [createMockProduct()];

  it('renders order view correctly', async () => {
    render(
      <ProfitabilityTable
        data={mockOrderData}
        loading={false}
        type="order"
        currency="USD"
      />
    );

    const table = getAntTable();
    expect(table).toBeInTheDocument();

    const headers = getAntTableHeaders();
    expect(headers).toHaveLength(6);
    expect(headers[0]).toHaveTextContent('Order Number');
    expect(headers[1]).toHaveTextContent('Date');
    expect(headers[2]).toHaveTextContent('Customer');
    expect(headers[3]).toHaveTextContent('Revenue (USD)');
    expect(headers[4]).toHaveTextContent('Cost (USD)');
    expect(headers[5]).toHaveTextContent('Profit (USD)');

    const cells = document.querySelectorAll('.ant-table-cell');
    const orderNumber = cells[6].textContent;
    const date = cells[7].textContent;
    const customer = cells[8].textContent;
    const revenue = cells[9].textContent;
    const cost = cells[10].textContent;
    const profit = cells[11].textContent;

    expect(orderNumber).toBe('ORDER-001');
    expect(date).toBe('1/1/2024');
    expect(customer).toBe('Test Customer');
    expect(revenue).toBe('1,000.00');
    expect(cost).toBe('800.00');
    expect(profit).toBe('200.00');
  });

  it('renders product view correctly', async () => {
    render(
      <ProfitabilityTable
        data={mockProductData}
        loading={false}
        type="product"
        currency="USD"
      />
    );

    const table = getAntTable();
    expect(table).toBeInTheDocument();

    const headers = getAntTableHeaders();
    expect(headers).toHaveLength(5);
    expect(headers[0]).toHaveTextContent('Product Name');
    expect(headers[1]).toHaveTextContent('Quantity');
    expect(headers[2]).toHaveTextContent('Revenue (USD)');
    expect(headers[3]).toHaveTextContent('Cost (USD)');
    expect(headers[4]).toHaveTextContent('Profit (USD)');

    const cells = document.querySelectorAll('.ant-table-cell');
    const productName = cells[5].textContent;
    const quantity = cells[6].textContent;
    const revenue = cells[7].textContent;
    const cost = cells[8].textContent;
    const profit = cells[9].textContent;

    expect(productName).toBe('Test Product');
    expect(quantity).toBe('10 pcs');
    expect(revenue).toBe('1,000.00');
    expect(cost).toBe('800.00');
    expect(profit).toBe('200.00');
  });

  it('displays loading state', async () => {
    render(
      <ProfitabilityTable
        data={[]}
        loading={true}
        type="order"
        currency="USD"
      />
    );

    const spinner = getAntSpin();
    expect(spinner).toBeInTheDocument();
  });

  it('handles currency change correctly', async () => {
    const tlOrderData = [createMockOrder({ currency: 'TL' })];
    
    render(
      <ProfitabilityTable
        data={tlOrderData}
        loading={false}
        type="order"
        currency="TL"
      />
    );

    const headers = getAntTableHeaders();
    expect(headers[3]).toHaveTextContent('Revenue (TL)');
    expect(headers[4]).toHaveTextContent('Cost (TL)');
    expect(headers[5]).toHaveTextContent('Profit (TL)');
  });

  it('handles empty data correctly', async () => {
    render(
      <ProfitabilityTable
        data={[]}
        loading={false}
        type="order"
        currency="USD"
      />
    );

    const table = getAntTable();
    expect(table).toBeInTheDocument();
    
    const rows = getAntTableRows();
    expect(rows).toHaveLength(0);
  });
});
