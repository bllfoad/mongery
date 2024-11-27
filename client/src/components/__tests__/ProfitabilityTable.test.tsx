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
    expect(headers).toHaveLength(8);
    expect(headers[0]).toHaveTextContent('Customer');
    expect(headers[1]).toHaveTextContent('Order Number');
    expect(headers[2]).toHaveTextContent('Date');
    expect(headers[3]).toHaveTextContent('Total Quantity');
    expect(headers[4]).toHaveTextContent('Revenue (USD)');
    expect(headers[5]).toHaveTextContent('Cost (USD)');
    expect(headers[6]).toHaveTextContent('Profit (USD)');
    expect(headers[7]).toHaveTextContent('Net Profit (USD)');

    const cells = document.querySelectorAll('.ant-table-cell');
    const customer = cells[8].textContent;
    const orderNumber = cells[9].textContent;
    const date = cells[10].textContent;
    const totalQuantity = cells[11].textContent;
    const revenue = cells[12].textContent;
    const cost = cells[13].textContent;
    const profit = cells[14].textContent;
    const netProfit = cells[15].textContent;

    expect(customer).toBe('Test Customer');
    expect(orderNumber).toBe('ORDER-001');
    expect(date).toBe('1/1/2024');
    expect(totalQuantity).toBe('10');
    expect(revenue).toBe('USD 1.000,00');
    expect(cost).toBe('USD 800,00');
    expect(profit).toBe('USD 200,00');
    expect(netProfit).toBe('USD 180,00');
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
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent('Product Name');
    expect(headers[1]).toHaveTextContent('Invoice Number');
    expect(headers[2]).toHaveTextContent('Quantity');
    expect(headers[3]).toHaveTextContent('Revenue (USD)');
    expect(headers[4]).toHaveTextContent('Cost (USD)');
    expect(headers[5]).toHaveTextContent('Profit (USD)');
    expect(headers[6]).toHaveTextContent('Net Profit (USD)');

    const cells = document.querySelectorAll('.ant-table-cell');
    const productName = cells[7].textContent;
    const invoiceNumber = cells[8].textContent;
    const quantity = cells[9].textContent;
    const revenue = cells[10].textContent;
    const cost = cells[11].textContent;
    const profit = cells[12].textContent;
    const netProfit = cells[13].textContent;

    expect(productName).toBe('Test Product');
    expect(invoiceNumber).toBe('INV-001');
    expect(quantity).toBe('10 pcs');
    expect(revenue).toBe('USD 1.000,00');
    expect(cost).toBe('USD 800,00');
    expect(profit).toBe('USD 200,00');
    expect(netProfit).toBe('USD 180,00');
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
    expect(headers[4]).toHaveTextContent('Revenue (TL)');
    expect(headers[5]).toHaveTextContent('Cost (TL)');
    expect(headers[6]).toHaveTextContent('Profit (TL)');
    expect(headers[7]).toHaveTextContent('Net Profit (TL)');
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
