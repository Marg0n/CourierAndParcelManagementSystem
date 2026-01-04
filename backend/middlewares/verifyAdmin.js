import { usersCollection } from "../db/mongo.js";

export default async function verifyAdmin(req, res, next) {
  const user = await usersCollection.findOne({ email: req.decoded.email });
  if (user?.role !== "Admin") {
    return res.status(403).send({ message: "Admin only" });
  }
  next();
}
