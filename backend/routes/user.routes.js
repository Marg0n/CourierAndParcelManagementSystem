// import express from "express";
// import verifyToken from "../middlewares/verifyToken.js";
// import { verifyRole } from "../middlewares/verifyRole.js";
// import { registerUser, loginUser, getUserInfo } from "../controllers/user.controller.js";

// const router = express.Router();

// router.post("/registration", registerUser);
// router.post("/login", loginUser);
// router.get("/get-user", verifyToken, getUserInfo);

// export default router;

import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import * as userController from "../controllers/user.controller.js";
import upload from "../config/multer.js"; // your memoryStorage multer
import {
  getUser,
  updateUser,
  uploadAvatar,
  uploadBanner,
  getAvatar,
  getBanner,
} from "../controllers/user.controller.js";

const router = express.Router();

// User routes
router.get("/get-user", verifyToken, userController.getUser);
router.put("/update-user/:email", verifyToken, userController.updateUser);
router.patch("/:id/avatar", verifyToken, userController.uploadAvatar);
router.patch("/:id/banner", verifyToken, userController.uploadBanner);
router.get("/:id/avatar", verifyToken, userController.getAvatar);
router.get("/:id/banner", verifyToken, userController.getBanner);

//* ------------------------------
//* Get current user info
//* GET /users/me
//* ------------------------------
router.get("/me", verifyToken, getUser);

//* ------------------------------
//* Update user info
//* PUT /users/:email
//* ------------------------------
router.put("/:email", verifyToken, updateUser);

//* ------------------------------
//* Upload avatar
//* POST /users/avatar/:id
//* ------------------------------
router.post(
  "/avatar/:id",
  verifyToken,
  upload.single("avatar"), // expects field name "avatar"
  uploadAvatar
);

//* ------------------------------
//* Upload banner
//* POST /users/banner/:id
//* ------------------------------
router.post(
  "/banner/:id",
  verifyToken,
  upload.single("banner"), // expects field name "banner"
  uploadBanner
);

//* ------------------------------
//* Get avatar
//* GET /users/avatar/:id
//* ------------------------------
router.get("/avatar/:id", getAvatar);

//* ------------------------------
//* Get banner
//* GET /users/banner/:id
//* ------------------------------
router.get("/banner/:id", getBanner);

export default router;