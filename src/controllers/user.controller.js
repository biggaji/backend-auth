/**
 * A collection of request handlers for the user modules
 */
import { redis } from '../../configs/redis.js';
import handleRBAC from '../../utils/handleRBAC.js';
import UserService from '../services/user.service.js';

const userService = new UserService();

async function createUserController(request, response, next) {
  try {
    const userCreationResponse = await userService.createUser(request.body);
    const { password, ...user } = userCreationResponse;
    response.status(201).json({
      user,
      message: 'Account created',
    });
  } catch (error) {
    next(error);
  }
}

async function userLoginController(request, response, next) {
  try {
    const accessToken = await userService.authenticate(request.body);
    response.status(200).json({
      accessToken,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
}

async function meController(request, response, next) {
  try {
    const { role, userId } = request.user;

    await handleRBAC(['admin', 'user'], role);

    const cacheKey = userId;

    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      const cacheResultJSON = JSON.parse(cachedResult);
      response.status(200).json(cacheResultJSON);
      return;
    }

    const me = await userService.me(userId);
    await redis.set(cacheKey, JSON.stringify(me), 'EX', 60);

    response.status(200).json(me);
  } catch (error) {
    next(error);
  }
}

async function fetchUsersController(request, response, next) {
  try {
    const { role } = request.user;
    await handleRBAC(['admin'], role);

    const cacheKey = 'users:all';

    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      const cacheResultJSON = JSON.parse(cachedResult);
      response.status(200).json(cacheResultJSON);
      return;
    }

    const users = await userService.users();

    await redis.set(cacheKey, JSON.stringify(users), 'EX', 60);

    response.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export {
  createUserController,
  userLoginController,
  meController,
  fetchUsersController,
};
