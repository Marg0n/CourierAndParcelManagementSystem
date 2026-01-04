import { parcelsCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

//* Create parcel (Customer only)
export const createParcel = async (req, res) => {
  try {
    const parcel = req.body;
    parcel.status = "Pending";
    parcel.createdAt = new Date();
    parcel.customerEmail = req.decoded.email;

    const result = await parcelsCollection.insertOne(parcel);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Parcel creation failed" });
  }
};

//* Get parcel by ID
export const getParcelById = async (req, res) => {
  try {
    const parcel = await parcelsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!parcel) return res.status(404).send({ message: "Parcel not found" });
    res.send(parcel);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

//* Get bookings of a customer
export const getMyBookings = async (req, res) => {
  try {
    const parcels = await parcelsCollection.find({ customerEmail: req.decoded.email }).toArray();
    res.send(parcels);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

/*
import { parcelsCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

export const createParcel = async (req, res) => {
    try {
        const parcel = req.body;
        parcel.status = "Pending";
        parcel.createdAt = new Date();
        parcel.customerEmail = req.decoded.email;

        const result = await parcelsCollection.insertOne(parcel);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const email = req.decoded.email;
        const bookings = await parcelsCollection.find({ customerEmail: email }).toArray();
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getParcelById = async (req, res) => {
    try {
        const { id } = req.params;
        const parcel = await parcelsCollection.findOne({ _id: new ObjectId(id) });
        if (!parcel) return res.status(404).json({ message: "Parcel not found" });
        res.json(parcel);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const trackParcel = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role } = req.decoded;

        let query = { _id: new ObjectId(id) };
        if (role === "Customer") query.customerEmail = email;
        if (role === "Delivery Agent") query.agentEmail = email;

        const parcel = await parcelsCollection.findOne(query);
        if (!parcel) return res.status(404).json({ message: "Parcel not found or access denied" });

        const response = {
            id: parcel._id,
            status: parcel.status,
            currentLocation: parcel.currentLocation || null,
            trackingHistory: parcel.trackingHistory || [],
            assignedAgent: parcel.agentEmail || null,
            customerEmail: parcel.customerEmail || null,
            createdAt: parcel.createdAt,
            deliveryDate: parcel.deliveryDate || null
        };

        if (role === "Admin") {
            response.parcelType = parcel.parcelType || null;
            response.size = parcel.size || null;
            response.price = parcel.price || null;
            response.paymentType = parcel.paymentType || null;
            response.deliveryInstructions = parcel.deliveryInstructions || null;
            response.contact = parcel.contact || null;
            response.pickupAddress = parcel.pickupAddress || null;
            response.deliveryAddress = parcel.deliveryAddress || null;
            response.barcode = parcel.barcode || null;
        }

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

*/