/**
 * A collection of request handlers for the user modules
 */

import UserService from '../services/user.service.js';

const userService = new UserService();

async function createUserController(request, response, next) {
  try {
    const userCreationResponse = await userService.createUser(request.body);
    const { password, ...user } = userCreationResponse;
    return response.status(201).json({
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
    return response.status(201).json({
      accessToken,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
}

export { createUserController, userLoginController };
