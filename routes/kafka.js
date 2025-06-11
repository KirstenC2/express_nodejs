const express = require('express');
const router = express.Router();
const kafkaController = require('../controllers/kafkaController');

// interface wise
router.get('/producer', kafkaController.index);
router.get('/consumer', kafkaController.index);

// function wise
router.post('/send', kafkaController.sendMessage);

// explanation page
router.get('/kafka/explanation', (req, res) => {
  res.render('kafka-explanation');
});
router.get('/explanation-zh', (req, res) => {
  res.render('kafka-explanation-zh');
});


module.exports = router;
