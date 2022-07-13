const { Router } = require('express');

const usersController = require('../controllers/usersController');

const router = Router();

router.post('/', usersController.create);

module.exports = router;