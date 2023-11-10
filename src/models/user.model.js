import mongoose, { Schema } from 'mongoose';

/**
 * Use mongoose schema to create a structured and organized database model
 */
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// A model is used to interact with the database
const UserModel = mongoose.model('user', userSchema);

export default UserModel;
