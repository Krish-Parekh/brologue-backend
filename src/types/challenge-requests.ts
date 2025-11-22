/**
 * Request types for challenge endpoints
 */

/**
 * Request parameters for getting a specific week
 */
export interface GetWeekRequestParams {
	weekId: number;
}

/**
 * Request parameters for getting a specific day
 */
export interface GetDayRequestParams {
	weekId: number;
	dayNumber: number;
}

/**
 * Request parameters for creating daily progress
 */
export interface CreateDailyProgressRequestParams {
	weekId: number;
	dayNumber: number;
}

/**
 * Request body for creating daily progress
 */
export interface CreateDailyProgressRequestBody {
	notes?: string;
}

