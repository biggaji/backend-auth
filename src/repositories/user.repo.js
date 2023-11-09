import UserModel from '../models/user.model.js';

/**
 * Low level code to communicate with the user model
 */
export default class UserRepo {
  async createUserRecord(payload) {
    try {
      const { firstName, lastName, email, password } = payload;

      const newUserRecord = new UserModel({
        firstName,
        lastName,
        email,
        password,
      });

      await newUserRecord.save();
      return newUserRecord;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const userRecord = await UserModel.findOne({ email });
      return userRecord;
    } catch (error) {
      throw error;
    }
  }
}