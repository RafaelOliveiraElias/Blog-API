const usersService = require('../services/usersService');

const usersController = {
  list: async (req, res) => {
    const users = await usersService.list();
    res.status(200).json(users);
  },

  create: async (req, res) => {
    const { email, password, displayName, image } = await usersService.validateBody(req.body);

    const user = await usersService.create({ email, password, displayName, image });

    res.status(201).json({ token: user });
  },

  findById: async (req, res) => {
    const user = await usersService.findByIdLazy(req.params.id);

    res.status(200).json(user);
  },
};

module.exports = usersController;