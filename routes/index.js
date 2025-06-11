const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

router.get('/', homeController.index);
router.get('/users/ui', userController.usersUI);
router.post('/users/ui/add', userController.addUser);
router.post('/users/ui/delete', userController.deleteUser);


module.exports = router;
