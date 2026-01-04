import { MongoClient, ServerApiVersion } from "mongodb";

//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//* MongoDB connection
//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const {
  DB_USER,
  DB_PASS,
  DB_NAME
} = process.env;

if (!DB_USER || !DB_PASS || !DB_NAME) {
  throw new Error("Database environment variables are missing");
}

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.pqvcpai.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqvcpai.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;


//? Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

// export const db = client.db(process.env.DB_NAME);

let db;

export async function connectDB() {
  if (db) return db;

  try {
    await client.connect();
    db = client.db(DB_NAME);
    console.log("MongoDB connected successfully");
    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

// export const usersCollection = db.collection("users");
// export const parcelsCollection = db.collection("parcels");

export const getUsersCollection = () => db.collection("users");
export const getParcelsCollection = () => db.collection("parcels");