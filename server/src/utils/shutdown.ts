import type { Server } from "node:http";
import { logger } from "./logger.utils";

export const registerGracefulShutdown = (
  server: Server,
  cleanup: () => void = () => undefined
): void => {
  let shuttingDown = false;

  const shutdown = (signal: string): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    cleanup();

    logger.info(`Received ${signal}; shutting down gracefully`);

    server.close((error) => {
      if (error) {
        logger.error("HTTP server shutdown failed", error);
        process.exitCode = 1;
        return;
      }

      logger.info("HTTP server closed");
      process.exitCode = 0;
    });
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
};
