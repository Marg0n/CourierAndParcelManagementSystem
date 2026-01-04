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

const router = express.Router();

// User routes
router.get("/get-user", verifyToken, userController.getUser);
router.put("/update-user/:email", verifyToken, userController.updateUser);
router.patch("/:id/avatar", verifyToken, userController.uploadAvatar);
router.patch("/:id/banner", verifyToken, userController.uploadBanner);
router.get("/:id/avatar", verifyToken, userController.getAvatar);
router.get("/:id/banner", verifyToken, userController.getBanner);

export default router;