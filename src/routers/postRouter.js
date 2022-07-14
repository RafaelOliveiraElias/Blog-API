const { Router } = require('express');
const postController = require('../controllers/postController');
const loginController = require('../controllers/loginController');

const router = Router();

router.use(loginController.validateToken);

router.post('/', postController.create);

router.get('/', postController.list);
router.get('/:id', postController.findById);

module.exports = router;