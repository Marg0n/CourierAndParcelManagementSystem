// import express from "express";
// import verifyToken from "../middlewares/verifyToken.js";
// import { verifyRole } from "../middlewares/verifyRole.js";
// import { createParcel, getParcelById, getMyBookings } from "../controllers/parcel.controller.js";

// const router = express.Router();

// router.post("/", verifyToken, verifyRole("Customer"), createParcel);
// router.get("/myBooking", verifyToken, verifyRole("Customer"), getMyBookings);
// router.get("/:id", verifyToken, getParcelById);

// export default router;

import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import verifyCustomer from "../middlewares/verifyCustomer.js";
import * as parcelController from "../controllers/parcel.controller.js";

const router = express.Router();

//* Customer routes
router.post("/", verifyToken, verifyCustomer, parcelController.createParcel);
router.get("/myBooking", verifyToken, verifyCustomer, parcelController.getMyBookings);
router.get("/:id", verifyToken, parcelController.getParcelById);
router.get("/:id/tracking", verifyToken, parcelController.trackParcel);

export default router;