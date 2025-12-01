import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ApiResponse } from "../types/response";
import Logger from "../utils/logger";

/**
 * Get health status of the server
 *
 * @route GET /api/v1/health
 * @returns Health status of the server
 */
export const getHealth = (_request: Request, response: Response) => {
	try {
		Logger.debug("[getHealth] Request started");
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.OK,
			message: "OK",
			data: null,
		};
		Logger.info("[getHealth] Health status: OK");
		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		Logger.error("[getHealth] Error: ", error);
	}
};