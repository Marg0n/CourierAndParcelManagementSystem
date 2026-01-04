import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.send(result);
};

export const login = async (req, res) => {
  const data = await authService.loginUser(req.body, req);
  res.send(data);
};
