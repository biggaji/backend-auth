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
userRouter.get('/u/:id', verifyAuth, (req, res, next) => {
  try {
    for (let i = 0; i <= 50_000_000; i++) {
      i++;
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export default userRouter;
