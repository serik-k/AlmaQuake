import express       from "express";
import cors          from "cors";
import { router }    from "./routes/api.routes";
import { startMonitorJob } from "./jobs/monitor.job";
import { config }    from "./config";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.listen(config.port, () => {
  console.log(`🟢 Сервер на порту ${config.port}`);
  startMonitorJob();
});
