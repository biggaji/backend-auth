/**
 * Router that controls the user module
 */

import { Router } from 'express';
import {
  createUserController,
  fetchUsersController,
  meController,
  userLoginController,
} from '../controllers/user.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.post('/', createUserController);
userRouter.post('/authenticate', userLoginController);
userRouter.get('/me', verifyAuth, meController);
userRouter.get('/', verifyAuth, fetchUsersController);

export default userRouter;
