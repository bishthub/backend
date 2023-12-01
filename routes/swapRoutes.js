const express = require('express');
const controller = require('../controllers/swapController');

const router = express.Router();

router.get('/chains', controller.getChains);
router.post('/done', controller.swapDone);

module.exports = router;
