const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initial cash balance
const INITIAL_CASH = 100000; // USD

// Read orders data
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');
console.log('Reading orders from:', ordersFilePath);
const ordersData = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
console.log('Orders loaded:', ordersData.orders.length);

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

// Get profitability by orders
app.get('/api/profitability/orders', (req, res) => {
  try {
    const { currency } = req.query;
    console.log('Getting orders profitability, currency:', currency);
    
    const orders = ordersData.orders.map(order => {
      const products = typeof order.products === 'string' 
        ? JSON.parse(order.products) 
        : order.products;
      let totalCost = 0;
      let totalQuantity = 0;
      
      products.forEach(product => {
        totalCost += calculateProductCost(product);
        totalQuantity += product.quantity;
      });

      const rate = currency === 'USD' ? order.primary_rate : order.secondary_rate;
      const revenue = order.subtotal * rate;
      const cost = totalCost * rate;
      const profit = revenue - cost;
      const net_profit = profit * 0.85; // Assuming 15% goes to Cüneyt bey
      const customer = typeof order.customer === 'string' 
        ? JSON.parse(order.customer) 
        : order.customer;

      return {
        order_id: order.order_id,
        order_number: order.order_number,
        order_date: order.order_date,
        customer: customer.companyname,
        total_quantity: totalQuantity,
        revenue,
        cost,
        profit,
        net_profit,
        currency
      };
    });

    console.log('Sending orders:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('Error processing orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get profitability by products
app.get('/api/profitability/products', (req, res) => {
  try {
    const { currency } = req.query;
    console.log('Getting products profitability, currency:', currency);
    const products = [];

    ordersData.orders.forEach(order => {
      const orderProducts = typeof order.products === 'string' 
        ? JSON.parse(order.products) 
        : order.products;
      const rate = currency === 'USD' ? order.primary_rate : order.secondary_rate;

      orderProducts.forEach(product => {
        const cost = calculateProductCost(product) * rate;
        const revenue = product.total_price * rate;
        const profit = revenue - cost;
        const net_profit = profit * 0.85; // Assuming 15% goes to Cüneyt bey
        const attributes = typeof product.attributes === 'string'
          ? JSON.parse(product.attributes)
          : product.attributes;

        products.push({
          order_id: order.order_id,
          product_name: product.product_name,
          invoice_number: order.invoice_number,
          quantity: product.quantity,
          revenue,
          cost,
          profit,
          net_profit,
          attributes,
          currency
        });
      });
    });

    console.log('Sending products:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error processing products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get total cash balance
app.get('/api/cash-balance', (req, res) => {
  try {
    const { currency } = req.query;
    console.log('Getting cash balance, currency:', currency);
    let totalProfit = 0;

    ordersData.orders.forEach(order => {
      const products = typeof order.products === 'string' 
        ? JSON.parse(order.products) 
        : order.products;
      let orderCost = 0;
      
      products.forEach(product => {
        orderCost += calculateProductCost(product);
      });

      const rate = currency === 'USD' ? order.primary_rate : order.secondary_rate;
      const revenue = order.subtotal * rate;
      const profit = revenue - (orderCost * rate);
      totalProfit += profit * 0.85; // Only add net profit to cash balance
    });

    const balance = INITIAL_CASH + totalProfit;
    console.log('Sending balance:', balance, currency);
    res.json({ balance, currency });
  } catch (error) {
    console.error('Error calculating balance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
