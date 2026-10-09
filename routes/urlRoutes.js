const express = require("express");
const crypto = require("crypto");
const Url = require("../models/Url");

const router = express.Router();

// Create a short link from a submitted URL.
router.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || typeof originalUrl !== "string" || !originalUrl.trim()) {
    return res.status(400).json({ error: "Please enter a URL." });
  }

  const cleanedUrl = originalUrl.trim();

  try {
    const parsedUrl = new URL(cleanedUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: "URL must start with http:// or https://." });
    }
  } catch {
    return res.status(400).json({ error: "Please enter a valid URL, including https://." });
  }

  // Try a few times in the very unlikely event of a code collision.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shortCode = crypto.randomBytes(4).toString("base64url");

    try {
      const url = await Url.create({ originalUrl: cleanedUrl, shortCode });
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      return res.status(201).json({
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${baseUrl}/${url.shortCode}`
      });
    } catch (error) {
      // MongoDB's duplicate-key error code is 11000.
      if (error.code === 11000) {
        continue;
      }

      console.error("URL save error:", error.message);
      return res.status(500).json({
        error: "Could not save your URL. Please check the database connection and try again."
      });
    }
  }

  return res.status(500).json({
    error: "Could not generate a unique short code. Please try again."
  });
});

module.exports = router;
