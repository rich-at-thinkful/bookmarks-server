require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const bookmarksRouter = require('./bookmarks-router');

const app = express();

const morganOption = (process.env.NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

console.log(process.env.API_TOKEN);

// app.use(function validateBearerToken(req, res, next) {
//   const apiToken = process.env.API_TOKEN;  
//   const authToken = req.get('Authorization');

//   if (!authToken || authToken.split(' ')[1] !== apiToken) {
//     logger.error(`Unauthorized request to path: ${req.path}`);
//     return res.status(401).json({ error: 'Unauthorized request' });
//   }
//   next();
// });

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(bookmarksRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = {error: {message: 'server error'} };
  } else {
    console.error(error);
    response= {message:error.message, error};
  }
  res.status(500).json(response);
});

module.exports = app;