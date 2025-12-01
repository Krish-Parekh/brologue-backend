import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema/users";
import type { ApiResponse } from "../types/response";
import type { UpdateUserNameResponseData, User } from "../types/user.types";
import Logger from "../utils/logger";

// ============================================================================
// Validation Schemas
// ============================================================================

const updateUserNameRequestSchema = z
	.object({
		first_name: z
			.string()
			.min(1, "first_name must be a non-empty string")
			.optional(),
		last_name: z
			.string()
			.min(1, "last_name must be a non-empty string")
			.optional(),
	})
	.refine(
		(data) => data.first_name !== undefined || data.last_name !== undefined,
		{
			message: "At least one of first_name or last_name must be provided",
		},
	)
	.strict();

// ============================================================================
// Controllers
// ============================================================================

/**
 * Update user's first name and/or last name
 *
 * Logic:
 * 1. Validates request body (at least one of first_name or last_name must be provided)
 * 2. Updates the user's name fields in the database
 * 3. Updates the updatedAt timestamp
 * 4. Returns the updated user data
 *
 * @route PATCH /api/v1/user
 * @returns Updated user data
 */
export const updateUserName = async (request: Request, response: Response) => {
	const { userId } = request;
	Logger.debug(`[updateUserName] Request started for userId: ${userId}`);

	try {
		// Validate request body
		const validationResult = updateUserNameRequestSchema.safeParse(
			request.body,
		);
		if (!validationResult.success) {
			Logger.warn(
				`[updateUserName] Validation failed for userId: ${userId}, errors: ${JSON.stringify(validationResult.error.issues)}`,
			);
			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: "Invalid request body",
				data: null,
			};
			return response.status(StatusCodes.BAD_REQUEST).json(apiResponse);
		}

		const { first_name, last_name } = validationResult.data;

		Logger.debug(
			`[updateUserName] Updating user name for userId: ${userId}, first_name: ${first_name ?? "not provided"}, last_name: ${last_name ?? "not provided"}`,
		);

		// Build update object with only provided fields
		const updateData: {
			firstName?: string;
			lastName?: string;
			updatedAt: Date;
		} = {
			updatedAt: new Date(),
		};

		if (first_name !== undefined) {
			updateData.firstName = first_name;
		}
		if (last_name !== undefined) {
			updateData.lastName = last_name;
		}

		// Update user in database
		const [updatedUser] = await db
			.update(users)
			.set(updateData)
			.where(eq(users.id, userId))
			.returning();

		if (!updatedUser) {
			Logger.warn(`[updateUserName] User not found for userId: ${userId}`);
			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.NOT_FOUND,
				message: "User not found",
				data: null,
			};
			return response.status(StatusCodes.NOT_FOUND).json(apiResponse);
		}

		Logger.info(
			`[updateUserName] User name updated successfully for userId: ${userId}`,
		);

		const apiResponse: ApiResponse<UpdateUserNameResponseData> = {
			code: StatusCodes.OK,
			message: "User name updated successfully",
			data: {
				user: updatedUser as User,
			} as UpdateUserNameResponseData,
		};

		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		Logger.error(
			`[updateUserName] Error updating user name for userId: ${userId}, error: ${error instanceof Error ? error.message : String(error)}`,
		);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
			data: null,
		};
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse);
	}
};
