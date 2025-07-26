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
//? csv
import { Parser } from "json2csv";
//? pdf
import PDFDocument from "pdfkit";
import stream from "stream";
import fs from "fs";
import path from "path";


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
                newUser.role = "Customer";

                //? check if the user exit
                const existingUser = await usersCollection.findOne({ email: newUser?.email });

                if (existingUser) {
                    return res.send({ message: "User already exists!" });
                }

                //? Get password and PEPPER
                const plainPassword = newUser?.password.trim();
                const pepper = process.env.BCRYPT_PEPPER;

                //? Parse salt rounds from env, with fallback
                const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 8;

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
                const pepper = process.env.BCRYPT_PEPPER;
                const isPasswordValid = await bcrypt.compare(password.trim() + pepper, user?.password);

                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid email or password!" });
                }

                //? Prepare payload
                const payload = {
                    id: user._id,
                    email: user.email,
                    role: user.role
                };

                //? Generate tokens
                const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
                    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "30d"
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
        //* Get Parcel Details by ID 
        //* ==================================

        app.get("/parcels/:id", verifyToken, async (req, res) => {
            const { id } = req.params;
            const parcel = await parcelsCollection.findOne({ _id: new ObjectId(id) });
            res.send(parcel);
        });

        //* ==================================
        //* Get All Parcels (Admin) 
        //* ==================================

        app.get("/admin/parcels", verifyToken, verifyAdmin, async (req, res) => {
            const result = await parcelsCollection.find().toArray();
            res.send(result);
        });

        //* ==================================
        //* Delivery Agent – Get Assigned Parcels 
        //* ==================================

        app.get("/agent/parcels", verifyToken, verifyDeliveryAgent, async (req, res) => {
            const email = req.decoded.email;
            const result = await parcelsCollection.find({ agentEmail: email }).toArray();
            res.send(result);
        });

        //* ==================================
        //* Get User Details
        //* ==================================

        app.get("/get-user", verifyToken, async (req, res) => {
            try {
                const email = req.decoded.email;

                const user = await usersCollection.findOne({ email }, { projection: { password: 0 } }); //! excluding password for privacy
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                res.send(user);
            } catch (err) {
                console.error("Error fetching user:", err);
                res.status(500).json({ message: "Internal server error" });
            }
        });

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

        //* ===================================
        //* Assign an Agent to Parcel (Admin)
        //* ===================================

        app.put("/parcels/:id/assign", verifyToken, verifyAdmin, async (req, res) => {
            const { id } = req.params;
            const { agentEmail } = req.body;

            const result = await parcelsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        agentEmail,
                        status: "Assigned"
                    }
                }
            );

            res.send(result);
        });

        //* ===================================
        //* Agent Updates Parcel Status
        //* ===================================

        app.put("/parcels/:id/status", verifyToken, verifyDeliveryAgent, async (req, res) => {
            const { id } = req.params;
            const { status } = req.body;

            const allowedStatuses = ["Picked Up", "In Transit", "Delivered", "Failed"];
            if (!allowedStatuses.includes(status)) return res.status(400).send({ message: "Invalid status" });

            const result = await parcelsCollection.updateOne(
                { _id: new ObjectId(id), agentEmail: req.decoded.email },
                {
                    $set: { status }
                }
            );

            res.send(result);
        });

        //* ===================================
        //* Get Parcel by ID (for tracking / detail view)
        //* ===================================

        app.get("/parcels/:id", verifyToken, async (req, res) => {
            try {
                const { id } = req.params;
                const parcel = await parcelsCollection.findOne({ _id: new ObjectId(id) });

                if (!parcel) return res.status(404).send({ message: "Parcel not found" });

                res.send(parcel);
            } catch (err) {
                console.error("Error fetching parcel:", err);
                res.status(500).send({ message: "Server error" });
            }
        });

        //* ===================================
        //* Admin: Get All Parcels
        //* ===================================

        app.get("/admin/parcels", verifyToken, verifyAdmin, async (req, res) => {
            try {
                const result = await parcelsCollection.find().toArray();
                res.send(result);
            } catch (err) {
                console.error("Error fetching parcels:", err);
                res.status(500).send({ message: "Server error" });
            }
        });

        //* ===================================
        //* Admin: Get All Users
        //* ===================================

        app.get("/admin/users", verifyToken, verifyAdmin, async (req, res) => {
            try {
                const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
                res.send(users);
            } catch (err) {
                console.error("Error fetching users:", err);
                res.status(500).send({ message: "Server error" });
            }
        });

        //* ===================================
        //* Agent: Get Assigned Parcels
        //* ===================================

        app.get("/agent/parcels", verifyToken, verifyDeliveryAgent, async (req, res) => {
            try {
                const email = req.decoded.email;
                const result = await parcelsCollection.find({ agentEmail: email }).toArray();
                res.send(result);
            } catch (err) {
                console.error("Error fetching assigned parcels:", err);
                res.status(500).send({ message: "Server error" });
            }
        });

        //* ===================================
        //* Agent: Update Current Location (for real-time tracking)
        //* ===================================

        app.put("/parcels/:id/location", verifyToken, verifyDeliveryAgent, async (req, res) => {
            try {
                const { id } = req.params;
                const { lat, lng } = req.body;

                const timestamp = new Date();
                const locationUpdate = {
                    lat,
                    lng,
                    timestamp
                };

                const result = await parcelsCollection.updateOne(
                    { _id: new ObjectId(id), agentEmail: req.decoded.email },
                    {
                        $set: { currentLocation: { lat, lng } },
                        $push: { trackingHistory: locationUpdate }
                    }
                );

                res.send(result);
            } catch (err) {
                console.error("Error updating location:", err);
                res.status(500).send({ message: "Server error" });
            }
        });

        //* ===================================
        //* Parcel Metrics API (for Admin Dashboard)
        //* ===================================

        app.get("/admin/dashboard-metrics", verifyToken, verifyAdmin, async (req, res) => {
            try {
                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                const totalParcels = await parcelsCollection.countDocuments();

                const dailyBookings = await parcelsCollection.countDocuments({
                    createdAt: { $gte: todayStart }
                });

                const failedDeliveries = await parcelsCollection.countDocuments({
                    status: "Failed"
                });

                const codParcels = await parcelsCollection.find({ paymentType: "COD" }).toArray();
                const codNumber = codParcels.length; //? number of COD parcels
                const codAmount = codParcels.reduce((total, parcel) => total + (parcel.price || 0), 0); //? sum of COD prices

                res.send({
                    totalParcels,
                    dailyBookings,
                    failedDeliveries,
                    codAmount,
                    codNumber
                });
            } catch (err) {
                console.error("Dashboard metrics error:", err);
                res.status(500).send({ message: "Error getting metrics" });
            }
        });

        //* ===================================
        //* Export Bookings as CSV
        //* ===================================

        app.get("/agent/export-csv", verifyToken, verifyDeliveryAgent, async (req, res) => {
            try {
                const parcels = await parcelsCollection.find().toArray();

                if (!parcels.length) {
                    return res.status(404).send({ message: "No parcels found to export" });
                }

                const fields = [
                    "customerEmail",
                    "contact",
                    "pickupAddress",
                    "deliveryAddress",
                    "deliveryDate",
                    "parcelType",
                    "size",
                    "paymentType",
                    "price",
                    "status",
                    "agentEmail",
                    "deliveryInstructions",
                    "barcode",
                    "createdAt"
                ];

                const parser = new Parser({ fields });
                const csv = parser.parse(parcels);

                res.header("Content-Type", "text/csv");
                res.attachment("parcel_bookings.csv");
                res.send(csv);
            } catch (err) {
                console.error("CSV export error:", err);
                res.status(500).send({ message: "CSV export failed" });
            }
        });

        //* ===================================
        //* Export Bookings as PDF
        //* ===================================        

        app.get("/agent/export-pdf", verifyToken, verifyDeliveryAgent, async (req, res) => {
            try {
                const agentEmail = req.decoded.email;
        
                //? Only parcels assigned to this delivery agent
                const parcels = await parcelsCollection.find({ agentEmail }).toArray();
        
                if (!parcels.length) {
                    return res.status(404).send({ message: "No parcels assigned to you." });
                }
        
                const doc = new PDFDocument({ margin: 40, size: "A4" });
                const bufferStream = new stream.PassThrough();
                res.setHeader("Content-Disposition", "attachment; filename=agent_parcels.pdf");
                res.setHeader("Content-Type", "application/pdf");
                doc.pipe(bufferStream);
                bufferStream.pipe(res);
        
                //? Header
                doc.fontSize(18).text(`Parcels Assigned to: ${agentEmail}`, { align: "center" });
                doc.moveDown(2);
        
                //? === Table Header ===
                const tableTop = 100;
                const rowHeight = 25;
        
                const headers = [
                    "Customer",
                    "Contact",
                    "Pickup",
                    "Delivery",
                    "Type",
                    "Size",
                    "Payment",
                    "Price",
                    "Status",
                    "Agent"
                ];
        
                const columnWidths = [80, 70, 70, 70, 50, 40, 60, 40, 60];
                let startX = 40;
        
                headers.forEach((header, i) => {
                    doc
                        .font("Helvetica-Bold")
                        .fontSize(10)
                        .rect(startX, tableTop, columnWidths[i], rowHeight)
                        .stroke()
                        .text(header, startX + 5, tableTop + 7, { width: columnWidths[i] - 10 });
                    startX += columnWidths[i];
                });
        
                //? === Table Rows ===
                let rowY = tableTop + rowHeight;
        
                parcels.forEach((p) => {
                    let x = 40;
                    const row = [
                        p.customerEmail,
                        p.contact || "-",
                        p.pickupAddress || "-",
                        p.deliveryAddress,
                        p.parcelType,
                        p.size || "-",
                        p.paymentType,
                        p.price?.toString() || "0",
                        p.status
                    ];
        
                    row.forEach((cell, i) => {
                        doc
                            .font("Helvetica")
                            .fontSize(8)
                            .rect(x, rowY, columnWidths[i], rowHeight)
                            .stroke()
                            .text(cell, x + 3, rowY + 7, { width: columnWidths[i] - 6, ellipsis: true });
                        x += columnWidths[i];
                    });
        
                    rowY += rowHeight;
        
                    if (rowY > 750) {
                        doc.addPage();
                        rowY = 50;
                    }
                });
        
                doc.end();
            } catch (err) {
                console.error("PDF export error:", err);
                res.status(500).send({ message: "Failed to export PDF" });
            }
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