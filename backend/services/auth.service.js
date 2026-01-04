import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { usersCollection } from "../db/mongo.js";

export async function registerUser(user) {
  //! existing registration logic here
}

export async function loginUser({ email, password }, req) {
  //! login logic here
}
