const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const userFile = path.join(__dirname, '../data/users.json');

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(userFile));

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send('<h3>Login gagal! Username atau password salah.</h3><a href="/login">Coba lagi</a>');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

module.exports = router;
