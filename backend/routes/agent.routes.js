// import express from "express";
// import verifyToken from "../middlewares/verifyToken.js";
// import { verifyRole } from "../middlewares/verifyRole.js";
// import {
//   getAssignedParcels,
//   updateParcelStatus,
//   updateParcelLocation,
//   exportParcelsCSV,
//   exportParcelsPDF
// } from "../controllers/agent.controller.js";

// const router = express.Router();
// const verifyAgent = verifyRole("Delivery Agent");

// router.use(verifyToken, verifyAgent);

// router.get("/parcels", getAssignedParcels);
// router.put("/parcels/:id/status", updateParcelStatus);
// router.put("/parcels/:id/location", updateParcelLocation);
// router.get("/export-csv", exportParcelsCSV);
// router.get("/export-pdf", exportParcelsPDF);

import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAgent from "../middlewares/verifyDeliveryAgent.js";
import * as agentController from "../controllers/agent.controller.js";

const router = express.Router();

//* Delivery Agent routes
router.get("/parcels", verifyToken, verifyAgent, agentController.getAssignedParcels);
router.put("/parcels/:id/status", verifyToken, verifyAgent, agentController.updateParcelStatus);
router.put("/parcels/:id/location", verifyToken, verifyAgent, agentController.updateCurrentLocation);
router.get("/export-csv", verifyToken, verifyAgent, agentController.exportCSV);
router.get("/export-pdf", verifyToken, verifyAgent, agentController.exportPDF);

export default router;
