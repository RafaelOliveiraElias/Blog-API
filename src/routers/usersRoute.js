const { Router } = require('express');
const loginController = require('../controllers/loginController');

const usersController = require('../controllers/usersController');

const router = Router();

router.post('/', usersController.create);

router.use(loginController.validateToken);

router.get('/', usersController.list);
router.get('/:id', usersController.findById);
router.delete('/me', usersController.remove);

module.exports = router;