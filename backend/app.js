import express from "express";
import corsConfig from "./config/cors.js";
import "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import parcelRoutes from "./routes/parcel.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(express.json());
app.use(corsConfig);
app.set("trust proxy", true);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/parcels", parcelRoutes);
app.use("/admin", adminRoutes);
app.use("/agent", agentRoutes);

app.get("/", (_, res) => res.send("Server is running 🚀"));

export default app;