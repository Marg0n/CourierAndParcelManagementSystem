import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import {
  getAllUsers,
  getAllParcels,
  updateUserByAdmin,
  assignAgentToParcel
} from "../controllers/admin.controller.js";

const router = express.Router();
const verifyAdmin = verifyRole("Admin");

router.use(verifyToken, verifyAdmin);

router.get("/users", getAllUsers);
router.get("/parcels", getAllParcels);
router.patch("/users/:id", updateUserByAdmin);
router.put("/parcels/:id/assign", assignAgentToParcel);

export default router;