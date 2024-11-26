import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

interface Order {
  order_id: number;
  order_number: string;
  order_date: string;
  customer: string;
  revenue: number;
  cost: number;
  profit: number;
  currency: string;
}

interface Product {
  order_id: number;
  product_name: string;
  quantity: number;
  unit: string;
  revenue: number;
  cost: number;
  profit: number;
  currency: string;
}

interface CashBalance {
  balance: number;
  currency: string;
}

export const profitabilityApi = createApi({
  reducerPath: 'profitabilityApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/',
    timeout: 10000 // 10 seconds timeout
  }),
  endpoints: (builder) => ({
    getOrderProfitability: builder.query<Order[], string>({
      query: (currency) => ({
        url: `profitability/orders`,
        params: { currency },
      }),
    }),
    getProductProfitability: builder.query<Product[], string>({
      query: (currency) => ({
        url: `profitability/products`,
        params: { currency },
      }),
    }),
    getCashBalance: builder.query<CashBalance, string>({
      query: (currency) => ({
        url: `cash-balance`,
        params: { currency },
      }),
    }),
  }),
});

export const {
  useGetOrderProfitabilityQuery,
  useGetProductProfitabilityQuery,
  useGetCashBalanceQuery,
} = profitabilityApi;
