const express = require('express');
const router = express.Router();
const kafkaController = require('../controllers/kafkaController');

// interface wise
router.get('/producer', kafkaController.index);
router.get('/consumer', kafkaController.index);

// function wise
router.post('/send', kafkaController.sendMessage);


module.exports = router;
