const { Router } = require('express');
const postController = require('../controllers/postController');
const loginController = require('../controllers/loginController');

const router = Router();

router.use(loginController.validateToken);

router.post('/', postController.create);
router.put('/:id', postController.edit);

router.get('/', postController.list);
router.get('/:id', postController.findById);
router.delete('/:id', postController.remove);

module.exports = router;