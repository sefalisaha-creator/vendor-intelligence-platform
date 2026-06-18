require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(
    "CRITICAL ERROR: MONGO_URI is not defined in the environment variables.",
  );
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB.");

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed. Exiting process...", error);
    process.exit(1);
  });
