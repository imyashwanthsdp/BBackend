const express = require('express');
const router = express.Router();
const fs = require('fs');

// Get all products
router.get('/products', (req,res) => {
    const items = JSON.parse(fs.readFileSync('./data/items.json','utf8') || '[]');
    res.json(items);
});

// Submit order
router.post('/submit-order', (req,res) => {
    const { name, email, phone, items } = req.body;
    const orders = JSON.parse(fs.readFileSync('./data/orders.json','utf8') || '[]');
    orders.push({ name, email, phone, items, date: new Date() });
    fs.writeFileSync('./data/orders.json', JSON.stringify(orders,null,2));
    res.json({ message: 'Order submitted successfully' });
});

module.exports = router;
