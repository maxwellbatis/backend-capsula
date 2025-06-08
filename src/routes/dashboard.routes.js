const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.get('/capsules/random', authenticate, dashboardController.getRandomCapsule);
router.get('/dreams/next', authenticate, dashboardController.getNextDream);
router.get('/couples/stats', authenticate, dashboardController.getCoupleStats);

module.exports = router;
