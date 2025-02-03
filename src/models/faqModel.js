import mongoose from "mongoose";

// Define the FAQ schema
const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: {
    hi: { question: String, answer: String },
    bn: { question: String, answer: String },
  },
});

// Create and export the FAQ model
const FAQ = mongoose.model("FAQ", faqSchema);
export default FAQ; // Default export for ES modules
