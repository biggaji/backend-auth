import {
  BadRequestExpection,
  InputValidationExpection,
  NotFoundExpection,
} from '../../utils/errors.js';
import UserRepo from '../repositories/user.repo.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const userRepo = new UserRepo();
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

export default class UserService {
  async createUser(payload) {
    try {
      const { firstName, lastName, email, password } = payload;

      if (!firstName || typeof firstName !== 'string') {
        throw new InputValidationExpection('Firstname is required');
      }

      if (!lastName || typeof lastName !== 'string') {
        throw new InputValidationExpection('Lastname is required');
      }

      if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        throw new InputValidationExpection('A valid email address is required');
      }

      if (
        !password ||
        typeof password !== 'string' ||
        !passwordRegex.test(password)
      ) {
        throw new InputValidationExpection('A valid password is required');
      }

      // Check if user exist already
      const userRecord = await userRepo.getUserByEmail(email);

      if (userRecord) {
        throw new BadRequestExpection('User account already exist');
      }

      // Hash password
      const hashedPassword = await argon2.hash(password);

      const HydratedPayload = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      };

      const newUser = await userRepo.createUserRecord(HydratedPayload);
      return newUser.toObject();
    } catch (error) {
      throw error;
    }
  }

  async authenticate(payload) {
    try {
      const { email, password } = payload;

      if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        throw new InputValidationExpection('A valid email address is required');
      }

      if (
        !password ||
        typeof password !== 'string' ||
        !passwordRegex.test(password)
      ) {
        throw new InputValidationExpection('A valid password is required');
      }

      const userRecord = await userRepo.getUserByEmail(email);

      if (!userRecord) {
        throw new NotFoundExpection('User not found');
      }

      // Check password is correct
      const isCorrectPassword = await argon2.verify(
        userRecord.password,
        password,
      );

      if (!isCorrectPassword) {
        throw new BadRequestExpection('Incorrect credentials');
      }

      // Hydrated payload to select custom fields
      const HydratedUserPayload = {
        userId: userRecord._id,
      };

      const accessToken = jwt.sign(
        HydratedUserPayload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
      );
      return accessToken;
    } catch (error) {
      throw error;
    }
  }
}
