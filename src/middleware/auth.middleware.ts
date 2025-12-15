import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Logger from "../utils/logger";
import type { ApiResponse } from "../types/response";

/**
 * Authentication middleware
 *
 * Checks if the user is authenticated using Clerk.
 * If authenticated, attaches userId to the request object.
 * If not authenticated, returns 401 Unauthorized response.
 *
 * The userId property is added to Request via TypeScript declaration merging
 * (see src/types/globals.d.ts)
 *
 * Usage:
 * ```typescript
 * router.get("/protected", requireAuth, protectedHandler);
 * ```
 */
export const requireAuth = (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	// Debug: Log authorization header (without token value for security)
	const authHeader = request.headers.authorization;
	const hasAuthHeader = !!authHeader;
	const authHeaderPrefix = authHeader?.substring(0, 7) || "none";
	
	Logger.debug(
		`[requireAuth] Request to ${request.path} - Auth header present: ${hasAuthHeader}, Prefix: ${authHeaderPrefix}`,
	);

	try {
		const { userId } = getAuth(request);

		if (!userId) {
			Logger.warn(
				`[requireAuth] Unauthorized request to ${request.path} - No userId found. Auth header present: ${hasAuthHeader}`,
			);
			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.UNAUTHORIZED,
				message: ReasonPhrases.UNAUTHORIZED,
			};
			return response.status(StatusCodes.UNAUTHORIZED).json(apiResponse);
		}

		Logger.debug(`[requireAuth] Authenticated request - userId: ${userId}`);
		
		// Attach userId to request object for use in controllers
		// TypeScript knows about this property via declaration merging in globals.d.ts
		request.userId = userId;
		next();
	} catch (error) {
		Logger.error(
			`[requireAuth] Error during authentication: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.UNAUTHORIZED,
			message: ReasonPhrases.UNAUTHORIZED,
		};
		return response.status(StatusCodes.UNAUTHORIZED).json(apiResponse);
	}
};
