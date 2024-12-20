import React from 'react';
import { render as rtlRender, RenderOptions, RenderResult, cleanup, act } from '@testing-library/react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import type { Store } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { profitabilityApi } from '../store/api';
import type { RootState } from '../store/store';
import { ConfigProvider } from 'antd';
import './i18n-test-config';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: Store;
}

interface ExtendedRenderResult extends RenderResult {
  store: Store;
}

let store: EnhancedStore;

beforeEach(() => {
  store = configureStore({
    reducer: {
      [profitabilityApi.reducerPath]: profitabilityApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(profitabilityApi.middleware),
  });
});

afterEach(() => {
  cleanup();
  if (store) {
    store.dispatch(profitabilityApi.util.resetApiState());
  }
});

export function render(
  ui: React.ReactElement,
  {
    preloadedState = {},
    ...renderOptions
  }: Omit<ExtendedRenderOptions, 'store'> = {}
): ExtendedRenderResult {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ConfigProvider theme={{ hashed: false }}>
          {children}
        </ConfigProvider>
      </Provider>
    );
  }

  const rendered = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    store,
    ...rendered,
  };
}

// Helper functions for formatting
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Mock data interfaces
interface MockOrderData {
  order_id?: number;
  order_number?: string;
  order_date?: string;
  customer?: string;
  total_quantity?: number;
  revenue?: number;
  cost?: number;
  profit?: number;
  net_profit?: number;
  currency?: string;
  key?: number;
}

interface MockProductData {
  product_name?: string;
  invoice_number?: string;
  quantity?: number;
  unit?: string;
  revenue?: number;
  cost?: number;
  profit?: number;
  net_profit?: number;
  currency?: string;
  order_id?: number;
  key?: number;
}

// Mock data generators
export function createMockOrder(overrides: MockOrderData = {}) {
  return {
    order_id: 1,
    order_number: 'ORDER-001',
    order_date: '1/1/2024',
    customer: 'Test Customer',
    total_quantity: 10,
    revenue: 1000,
    cost: 800,
    profit: 200,
    net_profit: 180,
    currency: 'USD',
    key: 1,
    ...overrides,
  };
}

export function createMockProduct(overrides: MockProductData = {}) {
  return {
    product_name: 'Test Product',
    invoice_number: 'INV-001',
    quantity: 10,
    unit: 'pcs',
    revenue: 1000,
    cost: 800,
    profit: 200,
    net_profit: 180,
    currency: 'USD',
    order_id: 1,
    key: 1,
    ...overrides,
  };
}

// Helper functions for Ant Design components
export const getAntTable = () => document.querySelector('.ant-table');
export const getAntTableBody = () => document.querySelector('.ant-table-tbody');
export const getAntTableRows = () => document.querySelectorAll('.ant-table-row');
export const getAntTableHeaders = () => document.querySelectorAll('.ant-table-thead th');
export const getAntStatistic = () => document.querySelector('.ant-statistic');
export const getAntStatisticTitle = () => document.querySelector('.ant-statistic-title');
export const getAntStatisticValue = () => document.querySelector('.ant-statistic-content-value');
export const getAntStatisticSuffix = () => document.querySelector('.ant-statistic-content-suffix');
export const getAntSpin = () => document.querySelector('.ant-spin');

// re-export everything
export * from '@testing-library/react';
