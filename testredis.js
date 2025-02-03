const { translateText } = require("./src/services/translateService");

(async () => {
  try {
    console.log("🔄 Translating text...");
    const translation = await translateText("What is Redis?", "hi");
    console.log(`✅ Translation: ${translation}`);

    const cachedTranslation = await translateText("What is Redis?", "hi");
    console.log(`✅ Cached Translation: ${cachedTranslation}`);
  } catch (err) {
    console.error("❌ Error in translation test:", err);
  }
})();
