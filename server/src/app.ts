import express          from "express";
import cors             from "cors";
import rateLimit        from "express-rate-limit";
import { router }       from "./routes/api.routes";
import { startMonitorJob } from "./jobs/monitor.job";
import { startTelegramBot } from "./services/telegram.service";
import { config }       from "./config";
import { logStorageConfiguration } from "./services/storage.service";

const app = express();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["https://almaquake-production.up.railway.app", "exp://", "http://localhost"];

app.use(cors({
  origin: (origin, cb) => {
    // allow mobile apps (no origin) and listed origins
    if (!origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
}));

app.use(express.json({ limit: "10kb" }));

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

const quakesLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});

app.use("/api/register", registerLimiter);
app.use("/api/quakes", quakesLimiter);
app.use("/api", router);

app.listen(config.port, () => {
  logStorageConfiguration();
  console.log(`🟢 Сервер на порту ${config.port}`);
  startMonitorJob();
  startTelegramBot();
});
