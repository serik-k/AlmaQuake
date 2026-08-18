import { Router } from "express";
import { getStats, testTelegramAlert } from "../controllers/admin.controller";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware";

export const adminRouter = Router();

adminRouter.use(adminAuthMiddleware);

adminRouter.get("/stats", getStats);
adminRouter.post("/test-telegram", testTelegramAlert);
