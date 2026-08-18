import { Request, Response, NextFunction } from "express";
import { fetchQuakes } from "../services/usgs.service";
import { sendSuccess } from "../utils/response.utils";
import { AppError } from "../utils/error.utils";

export async function getQuakes(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const quakes = await fetchQuakes();
    // Return quakes data directly (compatible with array expectations and standard success wrap)
    sendSuccess(res, quakes);
  } catch (err: any) {
    next(AppError.internal(`Failed to fetch earthquake data: ${err.message}`));
  }
}
