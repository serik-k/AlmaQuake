import express from "express";
import cors from "cors";
import { apiRouter } from "./routes";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware";
import { startMonitorJob } from "./jobs/monitor.job";
import { startTelegramBot } from "./services/telegram.service";
import { config } from "./config";
import { logStorageConfiguration } from "./services/storage.service";
import { logger } from "./utils/logger.utils";

const app = express();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : ["https://almaquake-production.up.railway.app"];

const isAllowedOrigin = (origin?: string): boolean => {
  // Native/mobile clients may omit the Origin header entirely.
  if (!origin) return true;

  // Expo development clients use exp:// URLs. Keep this explicit instead of
  // accepting arbitrary strings that merely share a prefix with an allowlist entry.
  if (origin.startsWith("exp://")) return true;

  return ALLOWED_ORIGINS.includes(origin);
};

app.use(
  cors({
    origin: (origin, cb) => {
      if (isAllowedOrigin(origin)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  })
);

app.use(express.json({ limit: "10kb" }));

// Mount central API router
app.use("/api", apiRouter);

// Centralized Error Handling Middleware
app.use(errorHandlerMiddleware);

app.listen(config.port, () => {
  logStorageConfiguration();
  logger.info(`🟢 Server started on port ${config.port}`);
  startMonitorJob();
  startTelegramBot();
});

export default app;
