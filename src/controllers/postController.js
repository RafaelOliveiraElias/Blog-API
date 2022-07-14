const { validateToken } = require('../services/jwtService');
const postService = require('../services/postService');

const postController = {
  list: async (req, res) => {
    const posts = await postService.list();
    res.status(200).json(posts);
  },

  create: async (req, res) => {
    const { title, content, categoryIds } = await postService.validateBody(req.body);
    const { authorization } = req.headers;

    const userId = validateToken(authorization).data.id;
    const user = await postService.create({ userId, title, content, categoryIds });

    res.status(201).json(user);
  },

  findById: async (req, res) => {
    const user = await postService.findByIdEager(req.params.id);

    res.status(200).json(user);
  },
};

module.exports = postController;