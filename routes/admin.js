const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'supersecretkey';
const ADMIN_PASSWORD = 'admin123'; // plain password, will hash once

// Hash admin password
const ADMIN_HASH = bcrypt.hashSync(ADMIN_PASSWORD, 10);

// Admin login
router.post('/login', async (req, res) => {
    const { password } = req.body;
    const valid = await bcrypt.compare(password, ADMIN_HASH);
    if(!valid) return res.status(401).json({ message: 'Invalid password' });
    const token = jwt.sign({ admin: true }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ token });
});

// Middleware for token authentication
function auth(req, res, next){
    const token = req.headers['authorization'];
    if(!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if(err) return res.status(401).json({ message: 'Unauthorized' });
        next();
    });
}

// Get all orders
router.get('/orders', auth, (req, res) => {
    const orders = JSON.parse(fs.readFileSync('./data/orders.json','utf8') || '[]');
    res.json(orders);
});

// Add product
router.post('/add-item', auth, (req, res) => {
    const { name, price, imageURL } = req.body;
    const items = JSON.parse(fs.readFileSync('./data/items.json','utf8') || '[]');
    items.push({ name, price, imageURL });
    fs.writeFileSync('./data/items.json', JSON.stringify(items,null,2));
    res.json({ message: 'Item added' });
});

// Clear orders (replace all orders)
router.post('/clear-orders', auth, (req,res) => {
  const { orders } = req.body;
  fs.writeFileSync('./data/orders.json', JSON.stringify(orders,null,2));
  res.json({ message:'Orders updated!' });
});

// Remove items (replace all items)
router.post('/remove-item', auth, (req,res) => {
  const { items } = req.body;
  fs.writeFileSync('./data/items.json', JSON.stringify(items,null,2));
  res.json({ message:'Item removed!' });
});


module.exports = router;

