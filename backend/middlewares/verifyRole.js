import { usersCollection } from "../db/mongo.js";

//? Factory function for role verification
export const verifyRole = (role) => {
  return async (req, res, next) => {
    try {
      const email = req.decoded.email;
      const user = await usersCollection.findOne({ email });

      if (!user || user.role !== role) {
        return res.status(403).json({ message: `Unauthorized: Not a ${role}!` });
      }

      next();
    } catch (err) {
      console.error("Role verification error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

//? Usage:
export const verifyAdmin = verifyRole("Admin");
export const verifyCustomer = verifyRole("Customer");
export const verifyDeliveryAgent = verifyRole("Delivery Agent");
