/**
 * User-related types
 */

import { z } from "zod";

// ============================================================================
// Validation Schemas
// ============================================================================

/**
 * Schema for validating update user name request body
 */
export const updateUserNameRequestSchema = z
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
// Request Types
// ============================================================================

/**
 * Request body for updating user name
 */
export interface UpdateUserNameRequestBody {
	first_name?: string;
	last_name?: string;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * User data
 */
export interface User {
	id: string;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	avatarUrl: string | null;
	createdAt: Date | null;
	updatedAt: Date | null;
}

/**
 * Response data for update user name endpoint
 */
export interface UpdateUserNameResponseData {
	user: User;
}
