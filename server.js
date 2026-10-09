const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const urlRoutes = require("./routes/urlRoutes");
const Url = require("./models/Url");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API for creating short URLs.
app.use("/api", urlRoutes);

// Redirect short codes to their original URLs.
app.get("/:shortCode", async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });

    if (!url) {
      return res.status(404).send(`
        <!doctype html>
        <html lang="en">
          <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Link not found</title>
          <style>body{font-family:Arial,sans-serif;max-width:600px;margin:80px auto;padding:20px;color:#243047;text-align:center}
          a{color:#3159c9}</style></head>
          <body><h1>Link not found</h1><p>This short link does not exist or may have been removed.</p>
          <a href="/">Return to URL Shortener</a></body>
        </html>
      `);
    }

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error.message);
    return res.status(500).send("Something went wrong while opening this link.");
  }
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Add it to your .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`URL Shortener is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not start the server:", error.message);
    process.exit(1);
  }
}

startServer();
