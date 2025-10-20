const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const discountFile = path.join(__dirname, '../data/discounts.json');

function readDiscounts() {
  if (!fs.existsSync(discountFile)) return [];
  return JSON.parse(fs.readFileSync(discountFile));
}

function saveDiscounts(data) {
  fs.writeFileSync(discountFile, JSON.stringify(data, null, 2));
}

// Halaman utama diskon
router.get('/discount', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../views/discount.html'));
});

// API ambil semua diskon
router.get('/discounts/api', (req, res) => {
  res.json(readDiscounts());
});

// API tambah diskon baru
router.post('/discounts/api', (req, res) => {
  const discounts = readDiscounts();
  const newDiscount = {
    id: Date.now(),
    name: req.body.name,
    discountType: req.body.discountType, // % atau Rp
    discountValue: req.body.discountValue,
    minPurchase: req.body.minPurchase || 0,
    productCount: req.body.productCount || 0,
    active: req.body.active ?? true
  };
  discounts.push(newDiscount);
  saveDiscounts(discounts);
  res.json({ message: 'Diskon berhasil ditambahkan!' });
});

module.exports = router;
