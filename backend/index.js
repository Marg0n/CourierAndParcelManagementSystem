//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//* Configuration
//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";
dotenv.config();


//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//* Configuration Constant
//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const app = express();
const port = process.env.PORT || 4000;


//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//* Middleware
//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
        ],
        credentials: true,
        optionsSuccessStatus: 200,
    })
)

//* ===================================
//* jwt validation middleware
//* ===================================

const verifyToken = async (req, res, next) => {
    const initialToken = req.header.authorization;

    //? from local storage
    if (!initialToken) return res.status(401).send({ message: "Unauthorized access!" });

    const token = initialToken.split(" ")[1];

    if (!token) return res.status(401).send({ message: "Unauthorized validation!" });

    if (token) {
        jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET,
            (err, decoded) => {
                if (err) {
                    console.log("err token :::>", err);
                    return res.status(401).send({ message: "Unauthorized access" });
                }

                req.decoded = decoded;
                next();
            }
        )
    }
}

//* ===================================
//* creating Token
//* ===================================

app.post("/jwt", async (req, res) => {
    const user = req.body;

    const token = jwt.sign(user, process.env.JWT_ACCESS_SECRET, process.env.JWT_ACCESS_EXPIRES_IN)

    res.send({ token });
})

//* ===================================
//* clearing Token
//* ===================================

app.get("/logout", async (req, res) => {
    const user = req.body;

    res.send({ success: true });
})

//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//* MongoDB connection
//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pqvcpai.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

//? Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

//* ===================================
//* Check if the server is up / running
//* ===================================

app.get("/", (req, res) => {
    res.send("Server is 🏃🏻‍➡️!!");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//* MongoDB connection API
//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


async function run() {
    try {
        // await client.connect();

        //* ===================================
        //* DB Connection
        //* ===================================

        const connectionDB = client.db(`${process.env.DB_NAME}`);

        const usersCollection = connectionDB.collection("users");


        //* ==================================
        //* Admin verify
        //* ==================================

        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            // console.log('from verify admin -->', email);
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            const isAdmin = user?.role === "Admin";

            if (!isAdmin) {
                return res.status(403).send({ message: "Unauthorized!! Not an Admin!" });
            }

            next();
        };

        //* ==================================
        //* Delivery Agent verify
        //* ==================================

        const verifyDeliveryAgent = async (req, res, next) => {
            const email = req.decoded.email;

            const query = { email: email };
            const user = await usersCollection.findOne(query);
            const isDeliveryAgent = user?.role === "Delivery Agent";

            if(!isDeliveryAgent) return res.status(403).send({ message: "Not a Delivery Agent!"});

            next();
        }

        //* ==================================
        //* Customer verify
        //* ==================================

        const verifyCustomer = async (req, res, next) => {
            const email = req.decoded.email;

            const query = { email: email };
            const user = await usersCollection.findOne(query);
            const isCustomer = user?.role === "Customer";

            if(!isCustomer) return res.status(403).send({ message: "Not a Customer!"});

            next();
        }

        //* ===================================
        //* DB default function
        //* ===================================
        app.use("/user", async (req, res) => { });

        // await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);