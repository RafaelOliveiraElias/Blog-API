const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { BlogPost, PostCategory, Category, User } = require('../database/models');
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

  validateBodyEdit: async (data) => {
    const { content, title } = data;
    if (!content || !title) {
      const e = new Error('Some required fields are missing');
        e.name = 'ValidationError';
      throw e;
    }
    return data;
  },

  list: async () => {
    const posts = await BlogPost.findAll({ 
      include: [{ model: User, as: 'user', attributes: { exclude: 'password' } },
      { model: Category, as: 'categories', through: { attributes: [] } }],
    });
    return posts;
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

  findByIdEager: async (id) => {
    const post = await BlogPost.findByPk(id, { 
      include: [{ model: User, as: 'user', attributes: { exclude: 'password' } },
      { model: Category, as: 'categories', through: { attributes: [] } }],
    });
    if (!post) {
      const e = new Error('Post does not exist');
      e.name = 'NotFoundError';
      throw e;
    }
    return post;
  },

  edit: async (userId, id, title, content) => {
    const { user } = await categoryService.findByIdEager(id);
    if (user.id !== userId) {
      const e = new Error('Unauthorized user');
        e.name = 'UnauthorizedError';
      throw e;
    }
    await BlogPost.update({ title, content }, { where: { id } });
    const post = await categoryService.findByIdEager(id);
    return post;
  },

  remove: async (userId, id) => {
    const { user } = await categoryService.findByIdEager(id);
    if (user.id !== userId) {
      const e = new Error('Unauthorized user');
        e.name = 'UnauthorizedError';
      throw e;
    }
    await BlogPost.destroy({ where: { id } });
  },

  listByQuery: async (query) => {
    const posts = await BlogPost.findAll({
      where: {
        // referencia: https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findandcountall
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{ model: User, as: 'user', attributes: { exclude: 'password' } },
      { model: Category, as: 'categories', through: { attributes: [] } }],
    });
    return posts;
  },
};

module.exports = categoryService;