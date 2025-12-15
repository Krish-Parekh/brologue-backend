import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { ApiResponse } from "../types/response";
import Logger from "../utils/logger";

/**
 * Global error handler middleware
 *
 * Handles all errors thrown in controllers and route handlers.
 * Logs the error and returns a standardized API response.
 *
 * Must be registered last in the Express app middleware chain.
 *
 * Usage:
 * ```typescript
 * app.use(errorHandler); // Must be last, after all routes
 * ```
 */
export const errorHandler = (
	error: Error,
	request: Request,
	response: Response,
	_next: NextFunction,
) => {
	Logger.error(`[${request.path}] Error:`, error);

	const apiResponse: ApiResponse<null> = {
		code: StatusCodes.INTERNAL_SERVER_ERROR,
		message:
			process.env.NODE_ENV === "production"
				? ReasonPhrases.INTERNAL_SERVER_ERROR
				: error.message,
		data: null,
	};

	response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse);
};
