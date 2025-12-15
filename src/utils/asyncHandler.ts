import type { NextFunction, Request, Response } from "express";

/**
 * Async handler wrapper for Express route handlers
 *
 * Wraps async route handlers to automatically catch promise rejections
 * and pass them to Express error handling middleware.
 *
 * This prevents unhandled promise rejections from crashing the application.
 *
 * Usage:
 * ```typescript
 * export const getAllWeeks = asyncHandler(async (request, response) => {
 *   // No try-catch needed - errors automatically go to error handler
 *   const data = await someAsyncOperation();
 *   response.json(data);
 * });
 * ```
 */
export const asyncHandler = (
	fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
