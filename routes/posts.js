import { Router } from 'express';
import controller from '../controllers/posts.js';
import authorize from '../middlewares/authorization.js';
import validator from "../middlewares/validation.js";
import postsSchemas from "../middlewares/schemas/postsSchemas.js";

const router = Router();

// Public routes
router.get('/', controller.getAllPosts);
router.get('/:id', controller.getPost);

// Protected routes (require authentication)
router.post('/', authorize,validator(postsSchemas.addOrUpdate,'body'),controller.createPost);
router.put('/:id', authorize,validator(postsSchemas.addOrUpdate,'body'), controller.updatePost);
router.delete('/:id', authorize, controller.deletePost);

export default router;