const categoryService = require('../services/categoryService');

const categoryController = {
  list: async (req, res) => {
    const categories = await categoryService.list();
    res.status(200).json(categories);
  },

  create: async (req, res) => {
    const { name } = await categoryService.validateBody(req.body);

    const user = await categoryService.create({ name });

    res.status(201).json(user);
  },

};

module.exports = categoryController;