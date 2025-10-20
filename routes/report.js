const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productFile = path.join(__dirname, '../data/products.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(productFile));
}

// halaman laporan (hanya untuk admin yang login)
router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../views/report.html'));
});

// API laporan (untuk ambil data produk)
router.get('/data', (req, res) => {
  const { search } = req.query;
  let products = readProducts();

  if (search) {
    const lower = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(lower));
  }

  res.json(products);
});

module.exports = router;
