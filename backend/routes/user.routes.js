import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { registerUser, loginUser, getUserInfo } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/registration", registerUser);
router.post("/login", loginUser);
router.get("/get-user", verifyToken, getUserInfo);

export default router;