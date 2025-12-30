const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/admin', adminRoutes);
app.use('/customer', customerRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

