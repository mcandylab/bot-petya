import { Redis } from "@upstash/redis";
import { config } from "dotenv";
config();

const redis = new Redis({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN,
});

export default redis;
