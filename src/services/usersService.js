const Joi = require('joi');
const { User } = require('../database/models');
const db = require('../database/models');
const jwtService = require('./jwtService');

const usersService = {
  validateBody: async (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      displayName: Joi.string().required().min(8),
      password: Joi.string().required().min(6),
      image: Joi.string().required(),
    });
    const { error, value } = schema.validate(data);  
    if (error) throw error;
    const { email } = data;
    const user = await db.User.findOne({
      attributes: { exclude: ['displayName', 'image', 'createdAt', 'updatedAt'] },
      where: { email }, 
    }); if (user) {
      const e = new Error('User already registered');
      e.name = 'UnauthorizedError';
      throw e;
    }
    return value;
  },

  list: async () => {
    const users = await User.findAll();
    return users;
  },

  create: async ({ email, password, displayName, image }) => {
    const user = await db.User.create({ email, password, displayName, image });

    const { id } = user.toJSON();

    const token = jwtService.createToken({ id, email });

    return token;
  },

};

module.exports = usersService;