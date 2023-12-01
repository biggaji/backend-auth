import { BadRequestExpection, InputValidationExpection, NotFoundExpection } from '../../utils/errors.js';
import UserRepo from '../repositories/user.repo.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { signupDTO, loginDTO } from '../../dtos/userAccountDTO.js';

const userRepo = new UserRepo();
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

const execRoles = ['ceo', 'developer', 'cto', 'marketing_executive'];
const nonExecRoles = ['accountant', 'financial_advisor'];

export default class UserService {
  async createUser(payload) {
    try {
      const { error, value } = signupDTO.validate(payload);

      if (error) {
        throw error;
      }

      const { email, password, role, firstName, lastName } = value;

      // Check if user exist already
      const userRecord = await userRepo.getUserByEmail(email);

      if (userRecord) {
        throw new BadRequestExpection('User account already exist');
      }

      // Hash password
      const hashedPassword = await argon2.hash(password);

      // Assign role to user ["admin", "user"]
      let assignedRole = role.toLowerCase().replace(/\s+/g, '_');

      // Sorting roles
      if (execRoles.includes(assignedRole)) {
        assignedRole = 'admin';
      } else if (nonExecRoles.includes(assignedRole)) {
        assignedRole = 'user';
      } else {
        throw new BadRequestExpection('Invalid role detected');
      }

      const HydratedPayload = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: assignedRole,
      };

      const newUser = await userRepo.createUserRecord(HydratedPayload);
      return newUser.toObject();
    } catch (error) {
      throw error;
    }
  }

  async authenticate(payload) {
    try {
      const { error, value } = loginDTO.validate(payload);

      if (error) {
        throw error;
      }

      const { email, password } = value;

      const userRecord = await userRepo.getUserByEmail(email);

      if (!userRecord) {
        throw new NotFoundExpection('User not found');
      }

      // Check password is correct
      const isCorrectPassword = await argon2.verify(userRecord.password, password);

      if (!isCorrectPassword) {
        throw new BadRequestExpection('Incorrect credentials');
      }

      // Hydrated payload to select custom fields to encrypt
      const HydratedUserPayload = {
        userId: userRecord._id,
        role: userRecord.role,
        firstName: userRecord.firstName,
      };

      const accessToken = jwt.sign(HydratedUserPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  // Profile Info
  async me(userId) {
    try {
      return await userRepo.getUserById(userId);
    } catch (error) {
      throw error;
    }
  }

  // All users - only admin is allowed to fetch all users info
  async users() {
    try {
      return await userRepo.fetchUserRecords();
    } catch (error) {
      throw error;
    }
  }
}
