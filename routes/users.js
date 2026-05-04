import {Router} from 'express';
import controller from '../controllers/users.js';
import validator from "../middlewares/validation.js";
import userSchemas from "../middlewares/schemas/userSchemas.js";
import authorization from "../middlewares/authorization.js";


const router = Router();

router.post('/registration',validator(userSchemas.registration,'body'), controller.registration);

router.post('/login',validator(userSchemas.login,'body'), controller.login);

router.get('/profile',authorization, controller.profile);
export default router;
