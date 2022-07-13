const loginService = require('../services/loginService');
const jwtService = require('../services/jwtService');

const loginController = {
  login: async (req, res) => {
    const { email, password } = loginService.validateBody(req.body);

    const token = await loginService.login(email, password);

    res.status(200).json({ token });
  },

  validateToken: (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
      const e = new Error('Token not found');
      e.name = 'UnauthorizedError';
      throw e;
    }
    
    jwtService.validateToken(authorization);

    next();
  },
};

module.exports = loginController;