const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const categoryFile = path.join(__dirname, "../data/categories.json");

// === Helper Functions ===
function readCategories() {
  if (!fs.existsSync(categoryFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(categoryFile));
  } catch (err) {
    console.error("❌ Error parsing categories.json:", err);
    return [];
  }
}

function saveCategories(data) {
  fs.writeFileSync(categoryFile, JSON.stringify(data, null, 2));
}

// =========================================
// 1️⃣ HALAMAN LIST CATEGORY (READ, UPDATE, DELETE UI)
// =========================================
router.get("/category", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/category.html"));
});

// =========================================
// 2️⃣ HALAMAN TAMBAH CATEGORY (CREATE UI)
// =========================================
router.get("/addcategory", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/addcategory.html"));
});

// =========================================
// 3️⃣ API: GET SEMUA KATEGORI (READ)
// =========================================
router.get("/categories/api", (req, res) => {
  const categories = readCategories();
  res.json(categories);
});

// =========================================
// 4️⃣ API: TAMBAH KATEGORI (CREATE)
// =========================================
router.post("/categories/api", (req, res) => {
  const categories = readCategories();
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Nama kategori wajib diisi!" });
  }

  const nextOrder = categories.length > 0
    ? Math.max(...categories.map(c => c.order || 0)) + 1
    : 1;

  const newCategory = {
    id: Date.now(),
    order: nextOrder,
    name: name.trim(),
    description: description || "",
    createdAt: new Date().toISOString(),
  };

  categories.push(newCategory);
  saveCategories(categories);

  console.log(`✅ Kategori ditambahkan: ${newCategory.name}`);
  res.status(201).json({ message: "Kategori berhasil ditambahkan!", category: newCategory });
});

// =========================================
// 5️⃣ API: UPDATE KATEGORI
// =========================================
router.put("/categories/api/:id", (req, res) => {
  const categories = readCategories();
  const index = categories.findIndex(c => c.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Kategori tidak ditemukan." });
  }

  categories[index] = {
    ...categories[index],
    name: req.body.name ?? categories[index].name,
    description: req.body.description ?? categories[index].description,
  };

  saveCategories(categories);
  console.log(`✏️ Kategori diperbarui: ${categories[index].name}`);
  res.json({ message: "Kategori berhasil diperbarui!", category: categories[index] });
});

// =========================================
// 6️⃣ API: HAPUS KATEGORI
// =========================================
router.delete("/categories/api/:id", (req, res) => {
  let categories = readCategories();
  const index = categories.findIndex(c => c.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Kategori tidak ditemukan." });
  }

  const deleted = categories.splice(index, 1)[0];
  saveCategories(categories);

  console.log(`🗑️ Kategori dihapus: ${deleted.name}`);
  res.json({ message: "Kategori berhasil dihapus!", deleted });
});

module.exports = router;
