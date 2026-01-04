import { usersCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
import { hashPassword, comparePassword } from "../utils/password.js";


//* Folder paths for fallback storage (optional)
const AVATAR_FOLDER = path.join(process.cwd(), "uploads", "avatars");
const BANNER_FOLDER = path.join(process.cwd(), "uploads", "banners");

//* Ensure directories exist
fs.mkdirSync(AVATAR_FOLDER, { recursive: true });
fs.mkdirSync(BANNER_FOLDER, { recursive: true });

//* ------------------------------
//* Get current user info
//* ------------------------------
export const getUser = async (req, res) => {
  try {
    const email = req.decoded.email;
    const user = await usersCollection.findOne(
      { email },
      { projection: { password: 0 } } // hide password
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//* ------------------------------
//* Update user info
//* ------------------------------
export const updateUser = async (req, res) => {
  try {
    const email = req.params.email;
    const updateData = req.body;

    const result = await usersCollection.updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "User not found" });

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//* ------------------------------
//* Upload avatar
//* ------------------------------
export const uploadAvatar = async (req, res) => {
  try {
    const { file } = req;
    const userId = req.params.id;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Store image buffer and MIME type in DB
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          avatar: {
            data: file.buffer,
            contentType: file.mimetype,
          },
          lastUpdated: new Date(),
        },
      }
    );

    res.json({ success: true, message: "Avatar uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

//* ------------------------------
//* Upload banner
//* ------------------------------
export const uploadBanner = async (req, res) => {
  try {
    const { file } = req;
    const userId = req.params.id;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          banner: {
            data: file.buffer,
            contentType: file.mimetype,
          },
          lastUpdated: new Date(),
        },
      }
    );

    res.json({ success: true, message: "Banner uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Banner upload failed" });
  }
};

//* ------------------------------
//* Get avatar image
//* ------------------------------
export const getAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user?.avatar?.data)
      return res.status(404).json({ message: "Avatar not found" });

    res.set("Content-Type", user.avatar.contentType);
    res.send(user.avatar.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve avatar" });
  }
};

//* ------------------------------
//* Get banner image
//* ------------------------------
export const getBanner = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user?.banner?.data)
      return res.status(404).json({ message: "Banner not found" });

    res.set("Content-Type", user.banner.contentType);
    res.send(user.banner.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve banner" });
  }
};


/*
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
*/