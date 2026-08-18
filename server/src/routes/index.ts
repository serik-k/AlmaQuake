import { Router } from "express";
import { quakeRouter } from "./quake.routes";
import { deviceRouter } from "./device.routes";
import { adminRouter } from "./admin.routes";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(quakeRouter);
apiRouter.use(deviceRouter);
apiRouter.use(adminRouter);
