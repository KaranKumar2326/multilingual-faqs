import FAQ from "../models/faqModel.js";
import { translateText } from "../services/translateService.js";

export const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and Answer are required." });
    }

    // Translate into Hindi and Bengali
    const question_hi = await translateText(question, "hi").catch(() => question);
    const answer_hi = await translateText(answer, "hi").catch(() => answer);
    const question_bn = await translateText(question, "bn").catch(() => question);
    const answer_bn = await translateText(answer, "bn").catch(() => answer);

    // Save translations in MongoDB
    const faq = new FAQ({
      question,
      answer,
      translations: {
        hi: { question: question_hi, answer: answer_hi },
        bn: { question: question_bn, answer: answer_bn },
      },
    });

    await faq.save();

    // Respond with the created FAQ
    res.status(201).json(faq);
  } catch (error) {
    console.error("❌ Error creating FAQ:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllFAQs = async (req, res, next) => {
  try {
    const { lang } = req.query; // Query parameter for language (e.g., ?lang=hi)


    // Fetch all FAQs from the database
    const faqs = await FAQ.find();

    // If a language query is provided, return translated text
    if (lang) {
      const translatedFAQs = faqs.map((faq) => {
        const translation = faq.translations[lang];
        return {
          question: translation?.question || faq.question,
          answer: translation?.answer || faq.answer,
        };
      });

      return res.status(200).json(translatedFAQs);
    }

    // Default: Return FAQs in English
    res.status(200).json(faqs);
  } catch (error) {
    console.error("❌ Error fetching FAQs:", error.message);
    res.status(500).json({ error: "Failed to fetch FAQs. Please try again later." });
  }
};

// export const updateFAQ = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { question, answer } = req.body;

//     // Validate input
//     if (!question || !answer) {
//       return res.status(400).json({ error: "Question and Answer are required." });
//     }

//     // Find and update the FAQ
//     const updatedFAQ = await FAQ.findByIdAndUpdate(
//       id,
//       { question, answer },
//       { new: true, runValidators: true } // Return the updated document
//     );
//     // update translations
//     const { question_hi, answer_hi } = await translateText(question, "hi").catch(() => question);
//     const { question_bn, answer_bn } = await translateText(answer, "bn").catch(() => answer);

//     updatedFAQ.translations = {
//       hi: { question: question_hi, answer: answer_hi },
//       bn: { question: question_bn, answer: answer_bn },
//     };
//     await updatedFAQ.save();

//     if (!updatedFAQ) {
//       return res.status(404).json({ error: "FAQ not found" });
//     }

//     res.status(200).json(updatedFAQ);
//   } catch (error) {
//     console.error("❌ Error updating FAQ:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    // Validate input
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and Answer are required." });
    }

    // 🔍 Fetch the existing FAQ to keep translations intact
    let existingFAQ = await FAQ.findById(id);
    if (!existingFAQ) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    // ✅ Preserve existing translations
    let translations = existingFAQ.translations || {};

    // 🔄 Generate new translations
    const question_hi = await translateText(question, "hi").catch(() => question);
    const answer_hi = await translateText(answer, "hi").catch(() => answer);
    const question_bn = await translateText(question, "bn").catch(() => question);
    const answer_bn = await translateText(answer, "bn").catch(() => answer);

    // ✅ Merge new translations with existing ones
    translations.hi = { question: question_hi, answer: answer_hi };
    translations.bn = { question: question_bn, answer: answer_bn };

    // Update the FAQ with new translations
    existingFAQ.question = question;
    existingFAQ.answer = answer;
    existingFAQ.translations = translations;

    // ✅ Save the updated FAQ
    await existingFAQ.save();

    res.status(200).json(existingFAQ);
  } catch (error) {
    console.error("❌ Error updating FAQ:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getFAQs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalFAQs = await FAQ.countDocuments();
    const faqs = await FAQ.find().skip(skip).limit(limit);

    res.json({
      data: faqs,
      totalPages: Math.ceil(totalFAQs / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("❌ Error fetching FAQs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the FAQ exists
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    // Delete the FAQ
    await FAQ.findByIdAndDelete(id);

    // Respond with success
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting FAQ:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
