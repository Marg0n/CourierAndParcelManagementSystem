import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import * as adminController from "../controllers/admin.controller.js";

const router = express.Router();

//* Admin-only routes
router.get("/users", verifyToken, verifyAdmin, adminController.getAllUsers);
router.get("/parcels", verifyToken, verifyAdmin, adminController.getAllParcels);
router.get("/dashboard-metrics", verifyToken, verifyAdmin, adminController.getDashboardMetrics);
router.patch("/users/:id", verifyToken, verifyAdmin, adminController.updateUserData);
router.put("/parcels/:id/assign", verifyToken, verifyAdmin, adminController.assignAgent);

export default router;