import  usersRouter from './users.js';
import  postRouter from './posts.js';
import controller from '../controllers/index.js';
import {Router} from 'express';


const selectorRouter = Router();
selectorRouter.get('/', controller.getHomePage);

selectorRouter.use('/users', usersRouter);
selectorRouter.use('/posts', postRouter);


export default selectorRouter;