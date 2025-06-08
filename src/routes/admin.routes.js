const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const { getStats } = require('../controllers/admin.controller');

router.get('/stats', isAdmin, getStats);

module.exports = router;