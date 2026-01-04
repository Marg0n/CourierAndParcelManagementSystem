import { usersCollection } from "../db/mongo.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

//* User registration
export const registerUser = async (req, res) => {
  try {
    const newUser = req.body;
    newUser.role = "Customer";
    newUser.status = "active";
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.isDeleted = false;

    const existingUser = await usersCollection.findOne({ email: newUser.email });
    if (existingUser) return res.status(400).send({ message: "User already exists" });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 8;
    const pepper = process.env.BCRYPT_PEPPER || "";
    newUser.password = await bcrypt.hash(newUser.password.trim() + pepper, saltRounds);

    const result = await usersCollection.insertOne(newUser);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Registration failed" });
  }
};

//* Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ message: "Email and password required" });

    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).send({ message: "Invalid credentials" });

    const pepper = process.env.BCRYPT_PEPPER || "";
    const isValid = await bcrypt.compare(password.trim() + pepper, user.password);
    if (!isValid) return res.status(401).send({ message: "Invalid credentials" });

    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "30d" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "365d" });

    res.send({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Login failed" });
  }
};

//* Get user info
export const getUserInfo = async (req, res) => {
  try {
    const email = req.decoded.email;
    const user = await usersCollection.findOne({ email }, { projection: { password: 0 } });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};