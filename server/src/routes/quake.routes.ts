import { Router } from "express";
import { getQuakes } from "../controllers/quake.controller";
import { quakesRateLimiter } from "../middlewares/rateLimiter.middleware";

export const quakeRouter = Router();

quakeRouter.get("/quakes", quakesRateLimiter, getQuakes);
