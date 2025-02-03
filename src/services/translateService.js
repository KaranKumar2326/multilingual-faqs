// const { exec } = require("child_process");
// const path = require("path");

// const translateText = (text, lang) => {
//   return new Promise((resolve, reject) => {
//     // Path to the Python script
//     const scriptPath = path.resolve(__dirname, "../../trans.py");

//     // Command to execute the Python script
//     const command = `python "${scriptPath}" "${text}" ${lang}`;

//     exec(command, { encoding: "utf-8" }, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`❌ Translation error: ${stderr.trim()}`);
//         return resolve(text); // Fallback to original text
//       }

//       // Trim and return the output
//       const result = stdout.trim();
//       console.log(`✅ Translation result for "${lang}": ${result}`);
//       resolve(result);
//     });
//   });
// };

// module.exports = { translateText };


import Redis from "ioredis";
import { exec } from "child_process";
import path from "path";

// ✅ Initialize Redis Client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1", // Use "redis" if running inside Docker
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 500, 5000), // Retry every 500ms, max 5s
});

// ✅ Redis Event Handlers
redisClient.on("connect", () => console.log("✅ Redis Connected"));
redisClient.on("ready", () => console.log("✅ Redis Ready to Use"));
redisClient.on("error", (err) => console.error("❌ Redis Connection Error:", err));

// ✅ Check Cache
const checkCache = async (key) => {
  try {
    console.log(`🔍 Checking cache for key: ${key}`);
    const data = await redisClient.get(key);
    if (data) {
      console.log(`✅ Cache hit: ${data}`);
      return data;
    }
    console.log(`🔄 Cache miss for key: ${key}`);
    return null;
  } catch (err) {
    console.error(`❌ Redis GET error:`, err);
    return null;
  }
};

// ✅ Store in Cache
const storeInCache = async (key, value) => {
  try {
    console.log(`💾 Storing in cache: ${key}`);
    await redisClient.set(key, value, "EX", 3600); // Cache expires in 1 hour
    console.log(`✅ Cached: ${key}`);
  } catch (err) {
    console.error(`❌ Redis SET error:`, err);
  }
};

// ✅ Translation Function with Cache
const translateText = async (text, lang) => {
  const cacheKey = `${text}:${lang}`;

  // ✅ Check cache first
  const cachedTranslation = await checkCache(cacheKey);
  if (cachedTranslation) return cachedTranslation;

  console.log(`🔄 Cache miss for key: ${cacheKey}, translating...`);

  // ✅ Execute Python Script for Translation
  const scriptPath = path.resolve("trans.py");
  const command = `python "${scriptPath}" "${text}" ${lang}`;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Translation script timeout")), 10000);

    exec(command, { encoding: "utf-8" }, (error, stdout, stderr) => {
      clearTimeout(timeout);

      if (error) {
        console.error(`❌ Translation error: ${stderr.trim()}`);
        return resolve(text); // Fallback to original text
      }

      const result = stdout.trim();
      console.log(`✅ Translation result: ${result}`);

      storeInCache(cacheKey, result); // ✅ Store result in cache
      resolve(result);
    });
  });
};

export { translateText };
