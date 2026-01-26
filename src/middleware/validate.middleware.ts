import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";
import type { ApiResponse } from "../types/response";
import Logger from "../utils/logger";

/**
 * Validation middleware factory
 *
 * Creates middleware that validates a specific part of the request
 * (body, params, or query) against a Zod schema.
 *
 * If validation fails, returns a 400 Bad Request response.
 * If validation succeeds, calls next() to continue to the controller.
 * Controllers should use schema.parse() to get typed and transformed data.
 *
 * Usage:
 * ```typescript
 * // Validate request body
 * router.post('/', validateBody(createMoodRequestSchema), createOrUpdateMood);
 *
 * // Validate request params
 * router.get('/:weekId', validateParams(weekRequestSchema), getWeek);
 *
 * // Validate request query
 * router.get('/', validateQuery(querySchema), getItems);
 * ```
 */

type ValidationSource = "body" | "params" | "query";

const createValidator =
	(source: ValidationSource) =>
		<T extends z.ZodTypeAny>(schema: T) => {
			return (req: Request, res: Response, next: NextFunction) => {
				const dataToValidate =
					source === "body"
						? req.body
						: source === "params"
							? req.params
							: req.query;

				// Use safeParse to validate without throwing
				const result = schema.safeParse(dataToValidate);

				if (!result.success) {
					const userId = (req as any).userId || "unknown";
					Logger.warn(
						`[validate] Validation failed for ${source}, userId: ${userId}, errors: ${JSON.stringify(result.error.issues)}`,
					);

					const apiResponse: ApiResponse<null> = {
						code: StatusCodes.BAD_REQUEST,
						message: "Validation failed",
						data: null,
					};

					return res.status(StatusCodes.BAD_REQUEST).json(apiResponse);
				}

				// Validation passed, continue to next middleware/controller
				// Controller will use parse() to get typed data
				next();
			};
		};

/**
 * Validates request body against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * router.post('/', validateBody(createMoodRequestSchema), createOrUpdateMood);
 * ```
 */
export const validateBody = createValidator("body");

/**
 * Validates request parameters against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * router.get('/:weekId', validateParams(weekRequestSchema), getWeek);
 * ```
 */
export const validateParams = createValidator("params");

/**
 * Validates request query parameters against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * router.get('/', validateQuery(querySchema), getItems);
 * ```
 */
export const validateQuery = createValidator("query");
