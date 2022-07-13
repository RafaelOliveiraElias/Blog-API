const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const loginController = require('../controllers/loginController');

const router = Router();

router.use(loginController.validateToken);

router.post('/', categoryController.create);

router.get('/', categoryController.list);

module.exports = router;