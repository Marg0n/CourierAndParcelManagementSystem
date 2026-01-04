import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { createParcel, getParcelById, getMyBookings } from "../controllers/parcel.controller.js";

const router = express.Router();

router.post("/", verifyToken, verifyRole("Customer"), createParcel);
router.get("/myBooking", verifyToken, verifyRole("Customer"), getMyBookings);
router.get("/:id", verifyToken, getParcelById);

export default router;