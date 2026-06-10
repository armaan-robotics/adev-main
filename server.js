// server.js
// Purpose: Tiny Express server that serves the website and saves submitted ideas to ideas.json

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Path to the ideas file — sits in the project root
const IDEAS_FILE = path.join(__dirname, "ideas.json");

// Parse incoming JSON request bodies
app.use(express.json());

// Serve all static files (HTML, CSS, JS) from the project folder
app.use(express.static(__dirname));

// ─── POST /submit-idea ───────────────────────────────────────────────────────
// Receives { text: "user's idea" } and appends it to ideas.json with a timestamp
app.post("/submit-idea", (req, res) => {
  const ideaText = req.body.text;

  // Basic validation
  if (!ideaText || ideaText.trim() === "") {
    return res.status(400).json({ error: "Idea cannot be empty." });
  }

  if (ideaText.trim().length > 300) {
    return res.status(400).json({ error: "Idea exceeds 300 character limit." });
  }

  // Build the new idea object
  const newIdea = {
    text: ideaText.trim(),
    timestamp: new Date().toISOString()
  };

  // Read existing ideas from file, or start with empty array if file doesn't exist
  let ideas = [];
  if (fs.existsSync(IDEAS_FILE)) {
    try {
      const raw = fs.readFileSync(IDEAS_FILE, "utf-8");
      ideas = JSON.parse(raw);
    } catch (e) {
      // If file is corrupted, start fresh
      ideas = [];
    }
  }

  // Prepend new idea so newest is always first
  ideas.unshift(newIdea);

  // Write back to file
  fs.writeFileSync(IDEAS_FILE, JSON.stringify(ideas, null, 2), "utf-8");

  res.json({ success: true });
});

// ─── GET /get-ideas ──────────────────────────────────────────────────────────
// Returns all ideas from ideas.json as a JSON array
app.get("/get-ideas", (req, res) => {
  if (!fs.existsSync(IDEAS_FILE)) {
    return res.json([]);
  }

  try {
    const raw = fs.readFileSync(IDEAS_FILE, "utf-8");
    const ideas = JSON.parse(raw);
    res.json(ideas);
  } catch (e) {
    res.json([]);
  }
});

// ─── START SERVER ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`ADev running at http://localhost:${PORT}`);
});
