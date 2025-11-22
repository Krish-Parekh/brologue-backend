import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import type { ApiResponse } from "../types/response";

/**
 * Extended Express Request type with authenticated user ID
 */
export interface AuthenticatedRequest extends Request {
	userId: string;
}

/**
 * Authentication middleware
 * 
 * Checks if the user is authenticated using Clerk.
 * If authenticated, attaches userId to the request object.
 * If not authenticated, returns 401 Unauthorized response.
 * 
 * Usage:
 * ```typescript
 * router.get("/protected", requireAuth, protectedHandler);
 * ```
 */
export const requireAuth = (
	req: Request,
	res: Response<ApiResponse<null>>,
	next: NextFunction,
) => {
	const { userId } = getAuth(req);

	if (!userId) {
		const response: ApiResponse<null> = {
			code: StatusCodes.UNAUTHORIZED,
			message: ReasonPhrases.UNAUTHORIZED,
		};
		return res.status(StatusCodes.UNAUTHORIZED).json(response);
	}

	// Attach userId to request object for use in controllers
	(req as AuthenticatedRequest).userId = userId;
	next();
};

