import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import errorHandler from './middlewares/errorHandler.js';
import routes from './routes/index.js';


const app = express();

// view engine setup
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), 'public')));

app.use(routes);

app.use(errorHandler.notFound);
app.use(errorHandler.errors);

export default app;
