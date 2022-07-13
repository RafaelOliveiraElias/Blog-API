const Joi = require('joi');
const db = require('../database/models');
const jwtService = require('./jwtService');


const loginService = {
  validateBody: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error, value } = schema.validate(data);

    if (error) throw error;
    
    return value;
  },

  login: async (email, password) => {
    const user = await db.User.findOne({
      attributes: { exclude: ['displayName', 'image', 'createdAt', 'updatedAt'] },
      where: { email }, 
    });

    if (!user || user.password !== password) {
      const e = new Error('Invalid fields');
      e.name = 'NotFoundError';
      throw e;
    }

    const { passwordHash, ...userWithoutPassword } = user.toJSON();

    const token = jwtService.createToken(userWithoutPassword);

    return token;
  },

  validateToken: (token) => {
    const data = jwtService.validateToken(token);

    return data;
  },
};

module.exports = loginService;