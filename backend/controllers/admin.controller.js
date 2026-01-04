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