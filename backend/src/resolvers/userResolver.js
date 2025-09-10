import Joi from "joi";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const userResolver = {
  Query: {
    users: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");
      try {
        return await User.find();
      } catch (err) {
        throw new Error("Error fetching users" + err.message);
      }
    },
    user: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      try {
        const foundUser = await User.findById(id);
        if (!foundUser) throw new Error("User not found");
        return foundUser;
      } catch (err) {
        throw new Error("Error fetching user" + err.message);
      }
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const { error } = userSchema.validate(input);
      if (error) throw new Error("Invalid input: " + error.details[0].message);
      try {
        const newUser = new User(input);
        return await newUser.save();
      } catch (err) {
        if (err.code === 11000) {
          throw new Error("Email already exists");
        }
        throw new Error("Error creating user" + err.message);
      }
    },

    updateUser: async (_, { id, input }, { user }) => {
      if (!user) throw new Error("Authentication required");
      if (user.userId !== id)
        throw new Error("Unauthorized access, cannot update other users");

      try {
        const updatedUser = await User.findByIdAndUpdate(id, input, {
          new: true,
        });
        if (!updatedUser) throw new Error("User not found for update");
        return updatedUser;
      } catch (err) {
        throw new Error("Error updating user" + err.message);
      }
    },

    deleteUser: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");
      if (user.userId !== id)
        throw new Error("Unauthorized access, cannot delete other users");
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new Error("User not found for deletion");
        return true;
      } catch (err) {
        throw new Error("Error deleting user" + err.message);
      }
    },

    login: async (_, { email, password}) =>{
        const user = await User.findOne({ email})
        if (!user) throw new Error("Invalid email or password")

        const isMatch = await user.comparePassword(password)
        if (!isMatch) throw new Error("Invalid email or password")
            const token = jwt.sign({ userId: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "3h"
        })
        return {token, user}
    }

  },
};
