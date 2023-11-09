/**
 * Router that controls the user module
 */

import { Router } from 'express';
import {
  createUserController,
  userLoginController,
} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post('/', createUserController);
userRouter.post('/authenticate', userLoginController);

export default userRouter;
