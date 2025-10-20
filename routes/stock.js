const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productFile = path.join(__dirname, '../data/products.json');

function readProducts() {
  try {
    if (!fs.existsSync(productFile)) {
      console.error('File products.json tidak ditemukan:', productFile);
      return [];
    }
    const data = fs.readFileSync(productFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products.json:', error);
    return [];
  }
}

function writeProducts(products) {
  try {
    fs.writeFileSync(productFile, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing products.json:', error);
  }
}

// Endpoint untuk ambil data dari products.json
router.get('/data', (req, res) => {
  const products = readProducts();
  res.json(products);
});

// Endpoint untuk update stok berdasarkan kode varian
router.put('/update/:code', (req, res) => {
  const { stock } = req.body;
  const products = readProducts();
  const product = products.find(p => p.code === req.params.code);
  if (product) {
    product.stock = stock;
    writeProducts(products);
    res.json({ message: 'Stok berhasil diperbarui' });
  } else {
    res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
});

module.exports = router;