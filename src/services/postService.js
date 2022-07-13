const Sequelize = require('sequelize');
const { BlogPost, PostCategory, Category } = require('../database/models');
const config = require('../database/config/config');

// referencia create:https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#creating-in-bulk
const sequelize = new Sequelize(config.development);

const categoryService = {
  validateBody: async (data) => {
    const { categoryIds, content, title } = data;
    if (!content || !title || !categoryIds) {
      const e = new Error('Some required fields are missing');
        e.name = 'ValidationError';
      throw e;
    }
    const { count } = await Category.findAndCountAll({ where: { id: categoryIds } });

    if (categoryIds.length !== count) {
      const e = new Error('"categoryIds" not found');
        e.name = 'ValidationError';
      throw e;
    }
    return data;
  },

  list: async () => {
    const categories = await Category.findAll();
    return categories;
  },

  create: async (data) => {
    const { userId, title, content, categoryIds } = data;
    const result = await sequelize.transaction(async (value) => {
      const post = await BlogPost.create({ userId, title, content }, { transaction: value });
      const allCategories = categoryIds.map((categoryId) => ({ postId: post.id, categoryId }));
      await PostCategory.bulkCreate(allCategories, { transaction: value });
      return post;
    });
  return result;
  },
};

module.exports = categoryService;