const validations = (message, res) => {
  if (message === '"email" is not allowed to be empty') {
    res.status(400).json({ message: 'Some required fields are missing' });
  } else res.status(400).json({ message });
};

module.exports = (err, _req, res, _next) => {
  const { name, message } = err;
  switch (name) {
    case 'ValidationError':
      validations(message, res);
      break;
    case 'ConflictError':
      res.status(409).json({ message });
      break;
    case 'UnauthorizedError':
      res.status(401).json({ message });
      break;
    case 'NotFoundError':
        res.status(404).json({ message });
      break;
    default:
      res.status(500).json({ message });
      break;
  }
};