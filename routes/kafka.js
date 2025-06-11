const express = require('express');
const router = express.Router();
const kafkaController = require('../controllers/kafkaController');

router.get('/ui', kafkaController.index);
router.post('/send', kafkaController.sendMessage);

module.exports = router;
