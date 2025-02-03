import path from "path"; // Ensure 'path' is imported
import express from "express"; // Ensure 'express' is imported
import app from "./app.js"; // Import your main app configuration
import { fileURLToPath } from "url"; // Needed to replace __dirname in ES modules

// Replace __dirname with ES module equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.resolve(__dirname, "../public")));

// Serve the admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "admin.html")); // Ensure file name matches
});

// Start the server ONLY if this is not a test environment
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default server; // ✅ Export the server instance for Mocha/Chai tests
