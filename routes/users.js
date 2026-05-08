import {Router} from 'express';
import controller from '../controllers/users.js';
import validator from "../middlewares/validation.js";
import userSchemas from "../middlewares/schemas/userSchemas.js";
import authorization from "../middlewares/authorization.js";
import views from "../controllers/views.js";


const router = Router();

router.post('/registration',validator(userSchemas.registration,'body'), controller.registration);
router.get('/registration', await views.viewsRender('registration'));

router.post('/login',validator(userSchemas.login,'body'), controller.login);
router.get('/login', await views.viewsRender('login'));

router.get('/profile',authorization, controller.profile);
export default router;
