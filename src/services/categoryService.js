const Joi = require('joi');
const { Category } = require('../database/models');
const db = require('../database/models');

const categoryService = {
  validateBody: async (data) => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });
    const { error, value } = schema.validate(data);  
    if (error) throw error;
    const { name } = data;
    const user = await Category.findOne({
      where: { name }, 
    }); if (user) {
      const e = new Error('Category already registered');
      e.name = 'ConflictError';
      throw e;
    }
    return value;
  },

  list: async () => {
    const categories = await Category.findAll();
    return categories;
  },

  create: async ({ name }) => {
    const user = await db.Category.create({ name });
    return user;
  },
};

module.exports = categoryService;