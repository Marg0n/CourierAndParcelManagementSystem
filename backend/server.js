import app from "./app.js";

const port = process.env.PORT || 4000;

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

(async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();

/** Notes
 * This is called an Immediately Invoked Async Function Expression (usually shortened to async IIFE).
 * Another way: 
 * async function startServer() {
      await connectDB();
      app.listen(port);
    }

    startServer();
 */
