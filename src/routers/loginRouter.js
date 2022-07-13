const { Router } = require('express');

const router = Router();

const loginController = require('../controllers/loginController');

router.post('/', loginController.login);

module.exports = router;