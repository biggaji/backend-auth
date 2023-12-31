import dotenv from 'dotenv';
dotenv.config();
import { Redis } from 'ioredis';
export const redis = new Redis(process.env.REDIS_CLUSTER_ID);
