import { Router } from "express";
import {
	createOrUpdateMood,
	getMoodByDate,
	getTodayMood,
} from "../controllers/mood.controller";
import { requireAuth } from "../middleware/auth.middleware";
import {
	validateBody,
	validateParams,
} from "../middleware/validate.middleware";
import {
	createMoodRequestSchema,
	getMoodRequestSchema,
} from "../types/mood.types";
import { asyncHandler } from "../utils/asyncHandler";

const moodRouter = Router();

// All mood routes require authentication
moodRouter.use(requireAuth);

// Create or update mood entry (defaults to today if date not provided)
moodRouter.post(
	"/",
	validateBody(createMoodRequestSchema),
	asyncHandler(createOrUpdateMood),
);

// Get today's mood entry
moodRouter.get("/", asyncHandler(getTodayMood));

// Get mood entry for a specific date
moodRouter.get(
	"/:date",
	validateParams(getMoodRequestSchema),
	asyncHandler(getMoodByDate),
);

export { moodRouter };
