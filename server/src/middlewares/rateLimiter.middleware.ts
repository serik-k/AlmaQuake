import rateLimit from "express-rate-limit";

export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many registration attempts, please try again later",
      code: "RATE_LIMIT_EXCEEDED",
    },
    timestamp: new Date().toISOString(),
  },
});

export const quakesRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many requests to earthquake API, please try again later",
      code: "RATE_LIMIT_EXCEEDED",
    },
    timestamp: new Date().toISOString(),
  },
});
