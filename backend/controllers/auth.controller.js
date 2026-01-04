import * as authService from "../services/auth.service.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.send(result);
};

export const login = async (req, res) => {
  const data = await authService.loginUser(req.body, req);
  res.send(data);
};

//* ==================================
//* Refresh Token to Access Token
//* ==================================

export const refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Refresh token is missing!" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (error, decoded) => {
        if (error) {
          return res.status(403).json({ message: "Invalid refresh token." });
        }

        const { id, email, role } = decoded;

        const payload = { id, email, role };

        const newAccessToken = jwt.sign(
          payload,
          process.env.JWT_ACCESS_SECRET,
          {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "30d"
          }
        );

        res.status(200).json({
          message: "Access token refreshed successfully.",
          accessToken: newAccessToken
        });
      }
    );
  } catch (err) {
    console.error("Refresh token error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err?.message });
  }
};

export const createJWT = (req, res) => {
  const user = req.body;

  const token = jwt.sign(
    user,
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );

  res.json({ token });
};

export const logout = (req, res) => {
  // JWT is stateless, logout is client-side
  res.json({ success: true });
};