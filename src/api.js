const express = require('express');
const errorMidwares = require('./middlewares/errorMidwares');
require('express-async-errors');

// ...

const app = express();

app.use(express.json());

// ...

const loginRouter = require('./routers/loginRouter');
const usersRouter = require('./routers/usersRoute');

app.use('/user', usersRouter);
app.use('/login', loginRouter);

app.use(errorMidwares);

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
