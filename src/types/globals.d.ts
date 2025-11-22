/// <reference types="@clerk/express/env" />

/**
 * Extend Express Request type using TypeScript declaration merging
 * This allows us to add custom properties to the Request object
 * that are added by our middleware
 */
declare namespace Express {
	export interface Request {
		userId: string;
	}
}
