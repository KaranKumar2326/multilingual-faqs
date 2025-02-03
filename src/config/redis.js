// import Redis from "ioredis";
// import dotenv from "dotenv";

// dotenv.config();

// const redisClient = new Redis({
//   host: process.env.REDIS_HOST || "redis", // Ensure 'redis' is used, NOT '127.0.0.1'
//   port: process.env.REDIS_PORT || 6379,
  
//   retryStrategy: (times) => Math.min(times * 500, 5000), // Retry connecting every 500ms, up to 5 seconds
// });
// console.log(process.env.REDIS_HOST);
// console.log(process.env.REDIS_PORT);





// redisClient.on("connect", () => console.log("✅ Connected to Redis"));
// redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

// export default redisClient;


import Redis from "ioredis";

// ✅ Redis Connection Configuration
const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1", // Use "redis" for Docker, "127.0.0.1" for local
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 500, 5000), // Retry every 500ms, max 5 seconds
});

// ✅ Redis Event Handlers
redisClient.on("connect", () => console.log("✅ Redis Connected"));
redisClient.on("ready", () => console.log("✅ Redis Ready to Use"));
redisClient.on("error", (err) => console.error("❌ Redis Connection Error:", err));
redisClient.on("end", () => console.log("❌ Redis Disconnected, attempting reconnect..."));

// ✅ Ensure Redis is connected before use
const connectRedis = async () => {
  if (!redisClient.status || redisClient.status === "end") {
    console.log("🔄 Connecting Redis Client...");
    await redisClient.connect();
  }
};

export { redisClient, connectRedis };
