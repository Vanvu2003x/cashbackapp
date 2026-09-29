import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || "*",
  shopeeAffApiUrl: process.env.SHOPEE_AFF_API_URL || "http://localhost:8787"
};
