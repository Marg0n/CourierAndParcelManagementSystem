
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//* Routers
import adminRoutes from "./routes/admin.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import userRoutes from "./routes/user.routes.js";
import parcelRoutes from "./routes/parcel.routes.js";

//* Middlewares
import verifyToken from "./middlewares/verifyToken.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

//* Utils
import AppError from "./utils/AppError.js";

//* DB connection
import { MongoClient, ServerApiVersion } from "mongodb";
dotenv.config();

const app = express();

//* ----------------------------
//* Middleware
//* ----------------------------
app.use(cors());
app.use(express.json()); //? body parser

//* ----------------------------
//* Routes
//* ----------------------------
app.use("/api/admin", adminRoutes);      //? Admin-only routes
app.use("/api/agent", agentRoutes);      //? Delivery Agent routes
app.use("/api/user", userRoutes);        //? Registration / Login / Profile
app.use("/api/parcels", parcelRoutes);   //? Parcel-related routes

//* ----------------------------
//* Health check / default route
//* ----------------------------
app.get("/", (_, res) => {
  res.send({ message: "🚀 Server is running!" });
});

//* ----------------------------
//* 404 Handler
//* ----------------------------
// app.use((_, res) => {
//   res.status(404).json({ message: "Route not found!" });
// });

//* ----------------------------
//* Catch all routes (/*)
//* ----------------------------
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server`,
      404
    )
  );
});


//* ----------------------------
//* Error Handler
//* ----------------------------
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Internal server error", error: err.message });
// });

//* ----------------------------
//* Global Error Handler
//* ----------------------------
app.use(globalErrorHandler);


export default app;