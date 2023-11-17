const express = require('express');
const controller = require('../controllers/swapController');

const router = express.Router();

router.get('/chains', controller.getChains);

module.exports = router;
