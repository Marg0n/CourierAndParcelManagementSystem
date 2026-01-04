import { usersCollection } from "../db/mongo.js";

// export default async function verifyAdmin(req, res, next) {
//   const user = await usersCollection.findOne({ email: req.decoded.email });
//   if (user?.role !== "Admin") {
//     return res.status(403).send({ message: "Admin only" });
//   }
//   next();
// }
//* ==================================
//* Admin verify middleware
//* ==================================

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  // console.log('from verify admin -->', email);
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  const isAdmin = user?.role === "Admin";

  if (!isAdmin) {
    return res.status(403).send({ message: "Unauthorized!! Admin only!" });
  }

  next();
};

export default verifyAdmin;