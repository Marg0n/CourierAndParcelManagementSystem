import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import {
  getAssignedParcels,
  updateParcelStatus,
  updateParcelLocation,
  exportParcelsCSV,
  exportParcelsPDF
} from "../controllers/agent.controller.js";

const router = express.Router();
const verifyAgent = verifyRole("Delivery Agent");

router.use(verifyToken, verifyAgent);

router.get("/parcels", getAssignedParcels);
router.put("/parcels/:id/status", updateParcelStatus);
router.put("/parcels/:id/location", updateParcelLocation);
router.get("/export-csv", exportParcelsCSV);
router.get("/export-pdf", exportParcelsPDF);

export default router;