const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productFile = path.join(__dirname, '../data/products.json');
const categoryFile = path.join(__dirname, '../data/categories.json'); // 🔥 Tambahan

// === Helper Functions ===
function readProducts() {
  if (!fs.existsSync(productFile)) return [];
  return JSON.parse(fs.readFileSync(productFile));
}

function saveProducts(data) {
  fs.writeFileSync(productFile, JSON.stringify(data, null, 2));
}

// === Helper untuk kategori ===
function readCategories() {
  if (!fs.existsSync(categoryFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(categoryFile));
  } catch (err) {
    console.error('❌ Error parsing categories.json:', err);
    return [];
  }
}

// =========================================
// 1️⃣ HALAMAN LIST PRODUK
// =========================================
router.get('/product', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../views/product.html'));
});

// =========================================
// 2️⃣ HALAMAN TAMBAH PRODUK
// =========================================
router.get('/addproduct', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../views/addproduct.html'));
});

// =========================================
// 3️⃣ HALAMAN STOCK
// =========================================
router.get('/stock', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../views/stock.html'));
});

// =========================================
// 4️⃣ API: GET SEMUA PRODUK
// =========================================
router.get('/api', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membaca data produk.' });
  }
});

// =========================================
// 5️⃣ API: GET PRODUK BY ID
// =========================================
router.get('/api/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find((p) => p.id == req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data produk.' });
  }
});

// =========================================
// 6️⃣ API: TAMBAH PRODUK BARU
// =========================================
router.post('/api', (req, res) => {
  try {
    const products = readProducts();

    if (!req.body.name || !req.body.code) {
      return res.status(400).json({ message: 'Nama dan kode produk wajib diisi!' });
    }

    const newProduct = {
      id: Date.now(),
      name: req.body.name,
      code: req.body.code,
      category: req.body.category || 'Uncategorized',
      stock: parseInt(req.body.stock) || 0,
      price: parseInt(req.body.price) || 0,
      size: req.body.size || '-',
      image: req.body.image || '/default.jpg',
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);
    saveProducts(products);
    console.log('✅ Produk ditambahkan:', newProduct.name);
    res.status(201).json({ message: 'Produk berhasil ditambahkan!', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan produk.' });
  }
});

// =========================================
// 7️⃣ API: UPDATE PRODUK
// =========================================
router.put('/api/:id', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex((p) => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

    products[index] = {
      ...products[index],
      ...req.body,
      stock: parseInt(req.body.stock ?? products[index].stock),
      price: parseInt(req.body.price ?? products[index].price),
    };

    saveProducts(products);
    res.json({ message: 'Produk berhasil diperbarui!', product: products[index] });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui produk.' });
  }
});

// =========================================
// 8️⃣ API: HAPUS PRODUK
// =========================================
router.delete('/api/:id', (req, res) => {
  try {
    let products = readProducts();
    const index = products.findIndex((p) => p.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

    const deleted = products.splice(index, 1);
    saveProducts(products);
    res.json({ message: `Produk ${deleted[0].name} berhasil dihapus!` });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus produk.' });
  }
});

// =========================================
// 9️⃣ API: UPDATE STOK (TAMBAH / KURANG)
// =========================================
router.patch('/api/:id/stock', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find((p) => p.id == req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan.' });

    const change = parseInt(req.body.change) || 0;
    product.stock = Math.max(0, (product.stock || 0) + change);
    saveProducts(products);
    res.json({ message: 'Stok berhasil diperbarui.', stock: product.stock });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui stok.' });
  }
});

// =========================================
// 🔟 API: GET SEMUA KATEGORI (untuk dropdown addproduct.html)
// =========================================
router.get('/categories/api', (req, res) => {
  try {
    const categories = readCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Gagal membaca data kategori.' });
  }
});

module.exports = router;
