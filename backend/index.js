//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//* Configuration
//* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
import { MongoClient, ServerApiVersion } from "mongodb";
import bcrypt from "bcryptjs";


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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqvcpai.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

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
    // console.log("MongoDB URI:", uri);
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
        const parcelsCollection = connectionDB.collection("parcels");


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
                return res.status(403).send({ message: "Unauthorized!! Not an Admin!" });
            }

            next();
        };

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

        //* ==================================
        //* Add an User / Users registration
        //* ==================================

        app.post("/registration", async (req, res) => {
            try {
                const newUser = req?.body;

                //? check if the user exit
                const existingUser = await usersCollection.findOne({ email: newUser?.email });

                if (existingUser) {
                    return res.send({ message: "User already exists!" });
                }

                //? Get password and PEPPER
                const plainPassword = newUser?.password;
                const pepper = process.env.BCRYPT_PEPPER || "";

                //? Parse salt rounds from env, with fallback
                const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

                //? Generate salt and hash password
                const hashedPassword = await bcrypt.hash(plainPassword + pepper, saltRounds);

                //? Replacing plain password with hashed password
                newUser.password = hashedPassword;

                const result = await usersCollection.insertOne(newUser);
                res.send(result);
            }
            catch (err) {
                //? If an error occurs during execution, catch it here
                console.error("Error updating user status:", err);

                res
                    .status(500)
                    .json({
                        message: "Internal server error during registration" || err?.message,
                        stack: err || " "
                    });
            }
        })

        //* ==================================
        //* User Login 
        //* ==================================

        app.post("/login", async (req, res) => {
            try {
                const { email, password } = req?.body;

                //? check
                if (!email || !password) {
                    return res.status(400).json({ message: "Email and password are required." });
                }

                //? find user
                const user = await usersCollection.findOne({ email });

                if (!user) {
                    return res.status(401).json({ message: "Invalid email or password." });
                }

                //? validate password
                const pepper = process.env.BCRYPT_PEPPER || "";
                const isPasswordValid = await bcrypt.compare(password + pepper, user?.password);

                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid email or password." });
                }

                //? Prepare payload
                const payload = {
                    id: user._id,
                    email: user.email,
                    role: user.role
                };

                //? Generate tokens
                const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
                    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d"
                });

                const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
                    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "365d"
                });

                res.status(200).json({
                    message: "Login successful",
                    accessToken,
                    refreshToken
                });

            } catch (err) {
                console.error("Login error:", err);
                res.status(500).json({ message: "Internal server error", error: err?.message });
            }
        })

        //* ==================================
        //* Get User Info 
        //* ==================================

        app.get("/get-user", async (req, res) => { })

        //* ===================================
        //* DB default function
        //* ===================================

        app.use("/user", async (req, res) => { });

        //* ===================================
        //* Create Parcel API (Customer only)
        //* ===================================

        app.post("/parcels", verifyToken, verifyCustomer, async (req, res) => {
            const parcel = req.body;
            parcel.status = "Pending";
            parcel.createdAt = new Date();
            parcel.customerEmail = req.decoded.email;

            const result = await parcelsCollection.insertOne(parcel);
            res.send(result);
        });

        //* ===================================
        //* Get Bookings for Customer
        //* ===================================

        app.get("/parcels/myBooking", verifyToken, verifyCustomer, async (req, res) => {
            const email = req.decoded.email;
            const result = await parcelsCollection
                .find({ customerEmail: email })
                .toArray();

            res.send(result);
        });


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