import express from "express";
import cors from "cors";
import { apiRouter } from "./routes";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware";
import { startMonitorJob, stopMonitorJob } from "./jobs/monitor.job";
import { startTelegramBot } from "./services/telegram.service";
import { config } from "./config";
import { logStorageConfiguration } from "./services/storage.service";
import { logger } from "./utils/logger.utils";
import { registerGracefulShutdown } from "./utils/shutdown";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : ["https://almaquake-production.up.railway.app"];

const isAllowedOrigin = (origin?: string): boolean => {
  if (!origin) return true;
  if (!isProduction && origin.startsWith("exp://")) return true;
  return ALLOWED_ORIGINS.includes(origin);
};

app.use(
  cors({
    origin: (origin, cb) => {
      if (isAllowedOrigin(origin)) cb(null, true);
      else cb(null, false);
    },
  })
);

app.use(express.json({ limit: "10kb" }));
app.use("/api", apiRouter);
app.use(errorHandlerMiddleware);

const server = app.listen(config.port, () => {
  logStorageConfiguration();
  logger.info(`🟢 Server started on port ${config.port}`);
  startMonitorJob();
  startTelegramBot();
});

registerGracefulShutdown(server, stopMonitorJob);

export default app;
