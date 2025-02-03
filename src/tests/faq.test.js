import request from "supertest"; // ✅ Use supertest instead of chai-http
import * as chai from "chai";
import app from "../server.js"; // ✅ Ensure correct import
import FAQ from "../models/faqModel.js"; // ✅ Ensure correct import

const { expect } = chai;

describe("FAQ API Tests", function () {
  this.timeout(10000); // ✅ Global timeout for all tests

  before(async function () {
    this.timeout(10000); // ✅ Timeout for database cleanup
    await FAQ.deleteMany({}); // ✅ Clear database before running tests
  });

  describe("POST /api/faqs", function () {
    it("should create a new FAQ via API", async function () {
      this.timeout(10000); // ✅ Fix timeout issue

      const res = await request(app)
        .post("/api/faqs")
        .send({
          question: "What is Express?",
          answer: "Express is a web framework for Node.js.",
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("question", "What is Express?");
      expect(res.body).to.have.property("answer", "Express is a web framework for Node.js.");
    });

    it("should fail to create FAQ without required fields", async function () {
      this.timeout(5000); // ✅ Set timeout for individual test
      const res = await request(app).post("/api/faqs").send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "Question and Answer are required.");
    });
  });

  describe("GET /api/faqs", function () {
    it("should fetch all FAQs via API", async function () {
      this.timeout(5000);
      const res = await request(app).get("/api/faqs");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("data").that.is.an("array");
    });
  });

  describe("DELETE /api/faqs/:id", function () {
    it("should delete an FAQ by ID via API", async function () {
      this.timeout(5000);

      // ✅ Create a new FAQ before attempting deletion
      const faq = await FAQ.create({ question: "Temporary FAQ?", answer: "Temporary answer." });

      const res = await request(app).delete(`/api/faqs/${faq._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "FAQ deleted successfully");

      // ✅ Verify the FAQ is deleted
      const deletedFAQ = await FAQ.findById(faq._id);
      expect(deletedFAQ).to.be.null;
    });
  });
});
