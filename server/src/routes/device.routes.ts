import { Router } from "express";
import { registerDevice, unregisterDevice } from "../controllers/device.controller";
import { registerRateLimiter } from "../middlewares/rateLimiter.middleware";

export const deviceRouter = Router();

deviceRouter.post("/register", registerRateLimiter, registerDevice);
deviceRouter.delete("/register", registerRateLimiter, unregisterDevice);
