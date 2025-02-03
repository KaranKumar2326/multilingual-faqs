// const express = require("express");
// const { createFAQ, getAllFAQs } = require("../controllers/faqController"); // Import the correct functions from faqController.js

// const router = express.Router();

// // Define the routes and map them to their respective controller functions
// router.post("/faqs", createFAQ); // POST request to create a new FAQ
// router.get("/faqs", getAllFAQs); // GET request to fetch all FAQs

// module.exports = router;

import express from "express";
import {
  createFAQ,
  getAllFAQs,
  updateFAQ,
  getFAQs,
  deleteFAQ, // Import the delete function
} from "../controllers/faqController.js";

const router = express.Router();

// Routes for FAQ operations
router.post("/faqs", createFAQ); // Create a new FAQ
router.get("/faqs", getFAQs); // Fetch FAQs with pagination
router.get("/faqs/all", getAllFAQs); // Fetch all FAQs
router.delete("/faqs/:id", deleteFAQ); // Delete an FAQ by ID
router.put("/faqs/:id", updateFAQ); // Update an FAQ by ID

export default router;

