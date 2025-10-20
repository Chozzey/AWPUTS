const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const reportRoutes = require('./routes/report');
const categoryRoutes = require('./routes/category');
const discountRoutes = require('./routes/discount');
const stockRouter = require('./routes/stock');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secretKeyFashion',
  resave: false,
  saveUninitialized: true
}));

// Routes
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/report', reportRoutes);
app.use('/', categoryRoutes);
app.use('/', discountRoutes);
app.use('/stock', stockRouter);

// Serve static pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
