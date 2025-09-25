import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  username: process.env.REDIS_USERNAME, // optional, only for cloud Redis ACL
  password: process.env.REDIS_PASSWORD,
  retryStrategy(times) {
    // reconnect after X ms
    return Math.min(times * 50, 2000);
  },
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis Error", err));

export default redis;
