const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const httpCodes = require("./http/httpCodes");
const preferences = require("./preferences/preferencesREST");

const app = express();
const PORT = 3000;

// Middleware
app.options("*", cors());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Routes for preferences
app.post("/preferences", preferences.savePreferences);
app.get("/preferences/:username", preferences.findPreferences);

// Handle unknown routes
app.use((req, res) => {
  res.status(httpCodes.codes.NOTFOUND).json("Not Found");
});

// Server stop detection (Ctrl-C)
process.on("SIGINT", () => {
  console.log("\nService Stopped by SIGINT (Ctrl-C)");
  process.exit();
});

// Start server
app.listen(PORT, () => {
  console.log(`Node Server at http://localhost:${PORT}`);
});
