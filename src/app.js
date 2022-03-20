import express from 'express';
import 'dotenv/config';
import * as path from 'path';
import { create } from 'express-handlebars';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import { body } from 'express-validator';
import { home } from './controllers/home.js';
import { SOURCE_PATH } from './consts.js';
import HandlebarsHelpers from './lib/HandlebarsHelpers.js';
import entities from './models/index.js';
import {
  deleteTask,
  getTasks,
  postTask,
  updateTask,
} from './controllers/api/task.js';
import {
  deleteCategory,
  getCategory,
  postCategory,
} from './controllers/api/category.js';
import {
  login,
  logout,
  postLogin,
  postRegister,
  register,
} from './controllers/authentication.js';
import loginAuthentication from './middleware/validation/loginAuthentication.js';
import registerAuthentication from './middleware/validation/registerAuthentication.js';
import { jwtAuth } from './middleware/jwtAuth.js';
import { getUsers } from './controllers/api/user.js';

const app = express();
app.use(express.static('public'));

// import bodyParser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// handlebars Init

const hbs = create({
  helpers: HandlebarsHelpers,
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(SOURCE_PATH, 'views'));

// App Routing

app.get('/', jwtAuth, home);
app.get('/login', login);
app.get('/register', register);

app.post('/register', ...registerAuthentication, postRegister, register);
app.post('/login', ...loginAuthentication, postLogin, login);
app.post('/logout', logout);

app.get('/api/user', getUsers);

app.get('/api/Task', jwtAuth, getTasks);
app.post('/api/Task', jwtAuth, postTask);
app.delete('/api/Task/:id', jwtAuth, deleteTask);
app.put('/api/Task', jwtAuth, updateTask);

app.get('/api/Category', jwtAuth, getCategory);
app.post('/api/Category', jwtAuth, postCategory);
app.delete('/api/Category/:id', jwtAuth, deleteCategory);

// create a connection

createConnection({
  type: process.env.DATABASE_TYPE,
  database: process.env.DATABASE_NAME,
  entities,
  synchronize: true,
}).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(
      `Application is running on http://localhost:${process.env.PORT}/.`
    );
  });
});
