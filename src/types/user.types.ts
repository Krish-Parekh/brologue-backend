/**
 * User-related types
 */

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

