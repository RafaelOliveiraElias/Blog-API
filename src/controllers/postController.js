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
    const post = await postService.create({ userId, title, content, categoryIds });

    res.status(201).json(post);
  },

  edit: async (req, res) => {
    const { title, content } = await postService.validateBodyEdit(req.body);
    const { authorization } = req.headers;
    const { id } = req.params;
    const userId = validateToken(authorization).data.id;
    const post = await postService.edit(userId, id, title, content);

    res.status(200).json(post);
  },

  findById: async (req, res) => {
    const post = await postService.findByIdEager(req.params.id);

    res.status(200).json(post);
  },

  remove: async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const userId = validateToken(authorization).data.id;
    await postService.findByIdEager(id);
    await postService.remove(userId, id);
    return res.status(204).end();
  },
};

module.exports = postController;