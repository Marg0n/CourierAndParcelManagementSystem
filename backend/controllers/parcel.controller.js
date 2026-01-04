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