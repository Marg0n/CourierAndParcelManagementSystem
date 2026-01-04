import express from "express";
import {
  login,
  register,
  refreshToken,
  generateJWT
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/jwt", generateJWT);

export default router;
