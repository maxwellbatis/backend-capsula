const express = require('express');
const router = express.Router();

// Rota simples para index do backend
router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API Amorarium!' });
});

module.exports = router;
