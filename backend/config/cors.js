import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  // add production URLs later
  // "https://yourdomain.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    //? Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

export default cors(corsOptions);
