import { usersCollection } from "../db/mongo.js";

//* ==================================
//* Customer verify middleware
//* ==================================

const verifyCustomer = async (req, res, next) => {
    const email = req.decoded.email;

    const query = { email: email };
    const user = await usersCollection.findOne(query);
    const isCustomer = user?.role === "Customer";

    if (!isCustomer) return res.status(403).send({ message: "Not a Customer!" });

    next();
}

export default verifyCustomer;