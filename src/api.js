const express = require('express');
require('express-async-errors');

// ...

const app = express();

app.use(express.json());

// ...

const loginRouter = require('./routers/loginRouter');
const usersRouter = require('./routers/usersRoute');

app.use('/user', usersRouter);
app.use('/login', loginRouter);

app.use((err, _req, res, _next) => {
  const { name, message } = err;
  switch (name) {
    case 'ValidationError':
      message === "\"email\" is not allowed to be empty"
        ? res.status(400).json({ message: "Some required fields are missing" }) : 
      res.status(400).json({ message });
      break;
    case 'NotFoundError':
      res.status(400).json({ message });
      break;
    case 'UnauthorizedError':
      res.status(409).json({ message });
      break;
    default:
      res.status(500).json({ message });
      break;
  }
});

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
