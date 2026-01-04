import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

export const db = client.db(process.env.DB_NAME);

export const usersCollection = db.collection("users");
export const parcelsCollection = db.collection("parcels");