import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
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
	const { userId } = getAuth(request);

	if (!userId) {
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.UNAUTHORIZED,
			message: ReasonPhrases.UNAUTHORIZED,
		};
		return response.status(StatusCodes.UNAUTHORIZED).json(apiResponse);
	}

	// Attach userId to request object for use in controllers
	// TypeScript knows about this property via declaration merging in globals.d.ts
	request.userId = userId;
	next();
};
