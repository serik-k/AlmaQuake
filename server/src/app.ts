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
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["https://almaquake-production.up.railway.app", "exp://", "http://localhost"];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow mobile apps (no origin) and listed origins
      if (!origin || ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
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
