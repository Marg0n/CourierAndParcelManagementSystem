const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    //? 🔹 Development: full error
    if (process.env.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }

    //? 🔹 Production: safe response
    if (process.env.NODE_ENV === "production") {
        //? Operational error (trusted)
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }

        //? Programming or unknown error
        console.error("🔥 ERROR:", err);

        return res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};

export default globalErrorHandler;
