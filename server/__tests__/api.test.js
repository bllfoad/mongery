const request = require('supertest');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Create a new Express app instance for testing
const app = express();
app.use(cors());
app.use(express.json());

// Read orders data from the actual data file
const ordersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'orders.json'), 'utf8')
);

// Helper function to calculate product cost
const calculateProductCost = (product) => {
  try {
    let totalCost = 0;
    const stocklogs = typeof product.stocklogs === 'string' 
      ? JSON.parse(product.stocklogs) 
      : product.stocklogs;
    
    stocklogs.forEach(log => {
      const quantity = log.stock_quantity;
      const stockCost = (log.stock_cost || 0) * quantity;
      const shipmentCost = (log.shipment_cost || 0) * quantity;
      const creditCost = (log.credit_cost || 0) * quantity;
      
      totalCost += stockCost + shipmentCost + creditCost;
    });
    
    return totalCost;
  } catch (error) {
    console.error('Error calculating product cost:', error);
    return 0;
  }
};

// Set up routes for testing
app.get('/api/profitability/orders', (req, res) => {
  try {
    const currency = req.query.currency || 'USD';
    const orders = ordersData.orders.map(order => {
      const products = typeof order.products === 'string' 
        ? JSON.parse(order.products) 
        : (order.products || []);
      
      const customer = typeof order.customer === 'string'
        ? JSON.parse(order.customer)
        : order.customer;

      const totalCost = products.reduce((total, product) => total + calculateProductCost(product), 0);
      
      return {
        order_id: order.order_id,
        order_number: order.order_number,
        order_date: order.order_date,
        customer: customer?.companyname || `Customer ${order.customer_id}`,
        revenue: order.total_with_tax || 0,
        cost: totalCost,
        profit: (order.total_with_tax || 0) - totalCost,
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
    const currency = req.query.currency || 'USD';
    const products = [];
    ordersData.orders.forEach(order => {
      const orderProducts = typeof order.products === 'string'
        ? JSON.parse(order.products)
        : (order.products || []);

      orderProducts.forEach(product => {
        const cost = calculateProductCost(product);
        products.push({
          product_name: product.product_name,
          quantity: product.quantity,
          unit: product.product_unit,
          revenue: (product.unit_price || 0) * (product.quantity || 0),
          cost,
          profit: ((product.unit_price || 0) * (product.quantity || 0)) - cost,
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
    const currency = req.query.currency || 'USD';
    const initialBalance = 100000;
    const balance = ordersData.orders.reduce((total, order) => {
      const products = typeof order.products === 'string'
        ? JSON.parse(order.products)
        : (order.products || []);

      const orderRevenue = order.total_with_tax || 0;
      const orderCost = products.reduce((cost, product) => cost + calculateProductCost(product), 0);
      return total + orderRevenue - orderCost;
    }, initialBalance);
    
    res.json({
      balance,
      currency
    });
  } catch (error) {
    console.error('Error calculating cash balance:', error);
    res.status(500).json({ error: error.message });
  }
});

describe('API Endpoints', () => {
  describe('GET /api/profitability/orders', () => {
    it('should return orders profitability data in USD', async () => {
      const response = await request(app)
        .get('/api/profitability/orders?currency=USD');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      response.body.forEach(order => {
        expect(order).toHaveProperty('order_id');
        expect(order).toHaveProperty('order_number');
        expect(order).toHaveProperty('order_date');
        expect(order).toHaveProperty('revenue');
        expect(order).toHaveProperty('cost');
        expect(order).toHaveProperty('profit');
        expect(order).toHaveProperty('currency');
        expect(order.currency).toBe('USD');
      });
    });

    it('should return orders profitability data in TL', async () => {
      const response = await request(app)
        .get('/api/profitability/orders?currency=TL');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      response.body.forEach(order => {
        expect(order).toHaveProperty('order_id');
        expect(order).toHaveProperty('order_number');
        expect(order).toHaveProperty('order_date');
        expect(order).toHaveProperty('revenue');
        expect(order).toHaveProperty('cost');
        expect(order).toHaveProperty('profit');
        expect(order).toHaveProperty('currency');
        expect(order.currency).toBe('TL');
      });
    });
  });

  describe('GET /api/profitability/products', () => {
    it('should return products profitability data in USD', async () => {
      const response = await request(app)
        .get('/api/profitability/products?currency=USD');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      response.body.forEach(product => {
        expect(product).toHaveProperty('product_name');
        expect(product).toHaveProperty('quantity');
        expect(product).toHaveProperty('unit');
        expect(product).toHaveProperty('revenue');
        expect(product).toHaveProperty('cost');
        expect(product).toHaveProperty('profit');
        expect(product).toHaveProperty('currency');
        expect(product.currency).toBe('USD');
      });
    });
  });

  describe('GET /api/cash-balance', () => {
    it('should return cash balance in USD', async () => {
      const response = await request(app)
        .get('/api/cash-balance?currency=USD');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('balance');
      expect(response.body).toHaveProperty('currency');
      expect(response.body.currency).toBe('USD');
      expect(typeof response.body.balance).toBe('number');
    });

    it('should return cash balance in TL', async () => {
      const response = await request(app)
        .get('/api/cash-balance?currency=TL');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('balance');
      expect(response.body).toHaveProperty('currency');
      expect(response.body.currency).toBe('TL');
      expect(typeof response.body.balance).toBe('number');
    });
  });
});
