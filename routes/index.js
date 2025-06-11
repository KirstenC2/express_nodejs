const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.index);
router.get('/users', homeController.getUsers);
router.get('/users/ui', homeController.usersUI);
router.post('/users/ui/add', homeController.addUser);
router.post('/users/ui/delete', homeController.deleteUser);


module.exports = router;
