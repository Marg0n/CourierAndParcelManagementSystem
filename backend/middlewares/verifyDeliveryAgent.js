import { usersCollection } from "../db/mongo.js";

//* ==================================
//* Delivery Agent verify middleware
//* ==================================

const verifyDeliveryAgent = async (req, res, next) => {
    const email = req.decoded.email;

    const query = { email: email };
    const user = await usersCollection.findOne(query);
    const isDeliveryAgent = user?.role === "Delivery Agent";

    if (!isDeliveryAgent) return res.status(403).send({ message: "Not a Delivery Agent!" });

    next();
}

export default verifyDeliveryAgent;