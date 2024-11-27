const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const CONFIG = {
  PORT: process.env.PORT || 5000,
  INITIAL_CASH_BALANCE: 100000,
  PROFIT_SHARING: {
    CUSTOMER_SHARE: 0.375,
    COMPANY_SHARE: 1.0
  },
  CURRENCIES: {
    USD: 'USD',
    TL: 'TL'
  }
};

const app = express();

app.use(cors());
app.use(express.json());

const parseJSON = (data) => {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return data;
  }
};

const readOrdersData = () => {
  try {
    const filePath = path.join(__dirname, 'data', 'orders.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading orders data:', error);
    throw new Error('Failed to read orders data');
  }
};

const calculateProductCost = (product) => {
  try {
    const stocklogs = parseJSON(product.stocklogs);
    
    return stocklogs.reduce((totalCost, log) => {
      const {
        stock_quantity: quantity,
        stock_cost: stockCost = 0,
        shipment_cost: shipmentCost = 0,
        credit_cost: creditCost = 0
      } = log;

      const unitCost = stockCost + shipmentCost + creditCost;
      return totalCost + (unitCost * quantity);
    }, 0);
  } catch (error) {
    console.error('Error calculating product cost:', error);
    return 0;
  }
};

const calculateOrderFinancials = (order) => {
  const products = parseJSON(order.products);
  
  const totalCost = products.reduce((sum, product) => 
    sum + calculateProductCost(product), 0);
  
  const totalQuantity = products.reduce((sum, product) => 
    sum + product.quantity, 0);
  
  const revenue = order.subtotal * order.primary_rate;
  const profit = revenue - totalCost;
  const netProfit = profit * CONFIG.PROFIT_SHARING.CUSTOMER_SHARE;

  return {
    revenue,
    cost: totalCost,
    profit,
    netProfit,
    totalQuantity
  };
};

const convertCurrency = (amount, currency, rates) => {
  const rate = currency === CONFIG.CURRENCIES.USD ? 1 : 
    rates.secondary_rate / rates.primary_rate;
  return Number((amount * rate).toFixed(2));
};

app.get('/api/profitability/orders', (req, res) => {
  try {
    const { currency } = req.query;
    const ordersData = readOrdersData();
    
    const orders = ordersData.orders.map(order => {
      const {
        revenue,
        cost,
        profit,
        netProfit,
        totalQuantity
      } = calculateOrderFinancials(order);

      const customer = parseJSON(order.customer);

      return {
        order_id: order.order_id,
        order_number: order.order_number,
        order_date: order.order_date,
        invoice_number: order.invoice_number,
        customer: customer.companyname,
        total_quantity: totalQuantity,
        revenue: convertCurrency(revenue, currency, order),
        cost: convertCurrency(cost, currency, order),
        profit: convertCurrency(profit, currency, order),
        net_profit: convertCurrency(netProfit, currency, order),
        currency
      };
    });

    res.json(orders);
  } catch (error) {
    console.error('Error processing orders:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profitability/products', (req, res) => {
  try {
    const { currency } = req.query;
    const ordersData = readOrdersData();
    const products = [];

    ordersData.orders.forEach(order => {
      const orderProducts = parseJSON(order.products);

      orderProducts.forEach(product => {
        const cost = calculateProductCost(product);
        const revenue = product.total_price * order.primary_rate;
        const profit = revenue - cost;
        const netProfit = profit * CONFIG.PROFIT_SHARING.CUSTOMER_SHARE;
        const attributes = parseJSON(product.attributes);

        products.push({
          order_id: order.order_id,
          product_name: product.product_name,
          invoice_number: order.invoice_number,
          quantity: product.quantity,
          revenue: convertCurrency(revenue, currency, order),
          cost: convertCurrency(cost, currency, order),
          profit: convertCurrency(profit, currency, order),
          net_profit: convertCurrency(netProfit, currency, order),
          attributes,
          currency
        });
      });
    });

    res.json(products);
  } catch (error) {
    console.error('Error processing products:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cash-balance', (req, res) => {
  try {
    const { currency } = req.query;
    const ordersData = readOrdersData();
    
    const totalProfits = ordersData.orders.reduce((sum, order) => {
      const { profit } = calculateOrderFinancials(order);
      return sum + (profit * CONFIG.PROFIT_SHARING.COMPANY_SHARE);
    }, 0);

    const totalBalance = CONFIG.INITIAL_CASH_BALANCE + totalProfits;
    const firstOrder = ordersData.orders[0];
    
    res.json({
      balance: convertCurrency(totalBalance, currency, firstOrder),
      currency
    });
  } catch (error) {
    console.error('Error calculating balance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(CONFIG.PORT, () => {
  console.log(`Server is running on port ${CONFIG.PORT}`);
});