import express from "express";
import {
  login,
  register,
  refreshToken,
  createJWT,
  logout
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/jwt", createJWT);
router.post("/refresh", refreshToken);
router.get("/logout", logout);

export default router;
