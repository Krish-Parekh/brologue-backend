import { Router } from "express";
import {
	createOrUpdateMood,
	getTodayMood,
	getMoodByDate,
} from "../controllers/mood.controller";
import { requireAuth } from "../middleware/auth.middleware";

const moodRouter = Router();

// All mood routes require authentication
moodRouter.use(requireAuth);

// Create or update mood entry (defaults to today if date not provided)
moodRouter.post("/", createOrUpdateMood);

// Get today's mood entry
moodRouter.get("/", getTodayMood);

// Get mood entry for a specific date
moodRouter.get("/:date", getMoodByDate);

export { moodRouter };

