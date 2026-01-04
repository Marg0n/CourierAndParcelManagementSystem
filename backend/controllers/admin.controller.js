import { usersCollection, parcelsCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

//* Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

//* Get all parcels
export const getAllParcels = async (req, res) => {
  try {
    const parcels = await parcelsCollection.find().toArray();
    res.send(parcels);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

//* Update user role/status
export const updateUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, status, statusChangeReason, statusChangedBy } = req.body;

    if (!statusChangeReason && !statusChangedBy)
      return res.status(400).json({ message: "No reason specified." });

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role, status, statusUpdatedByAdmin: new Date(), statusChangeReason, statusChangedBy } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, modifiedCount: result.modifiedCount, result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

//* Assign agent to parcel
export const assignAgentToParcel = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentEmail } = req.body;

    const result = await parcelsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { agentEmail, status: "Assigned" } }
    );

    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
};

/*
import { usersCollection, parcelsCollection } from "../db/mongo.js";
import { ObjectId } from "mongodb";

export const getAllUsers = async (req, res) => {
    try {
        const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllParcels = async (req, res) => {
    try {
        const parcels = await parcelsCollection.find().toArray();
        res.json(parcels);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getDashboardMetrics = async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const totalParcels = await parcelsCollection.countDocuments();
        const dailyBookings = await parcelsCollection.countDocuments({ createdAt: { $gte: todayStart } });
        const failedDeliveries = await parcelsCollection.countDocuments({ status: "Failed" });

        const codParcels = await parcelsCollection.find({ paymentType: "COD" }).toArray();
        const codNumber = codParcels.length;
        const codAmount = codParcels.reduce((total, parcel) => total + (parcel.price || 0), 0);

        res.json({ totalParcels, dailyBookings, failedDeliveries, codNumber, codAmount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateUserData = async (req, res) => {
    try {
        const userId = req.params.id;
        const { role, status, statusChangeReason, statusChangedBy } = req.body;

        if (!statusChangeReason && !statusChangedBy) {
            return res.status(400).json({ message: "No reason specified" });
        }

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { role, status, statusUpdatedByAdmin: new Date(), statusChangeReason, statusChangedBy } }
        );

        if (result.matchedCount === 0) return res.status(404).json({ message: "User not found" });

        res.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export const assignAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const { agentEmail } = req.body;

        const result = await parcelsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { agentEmail, status: "Assigned" } }
        );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

 */