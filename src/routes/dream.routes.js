const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const dreamController = require('../controllers/dreamController');

// Listar todos os sonhos do casal
router.get('/', authenticate, dreamController.list);
// Criar novo sonho
router.post('/', authenticate, dreamController.create);
// Atualizar sonho
router.put('/:id', authenticate, dreamController.update);
// Deletar sonho
router.delete('/:id', authenticate, dreamController.remove);

module.exports = router;
