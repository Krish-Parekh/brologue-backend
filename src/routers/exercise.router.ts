import { Router } from "express";
import {
	createOrUpdateExerciseSession,
	getExercisesByDate,
	getTodayExercises,
} from "../controllers/exercise.controller";
import { requireAuth } from "../middleware/auth.middleware";

const exerciseRouter = Router();

// All exercise routes require authentication
exerciseRouter.use(requireAuth);

// Create or update exercise session (defaults to today if date not provided)
exerciseRouter.post("/", createOrUpdateExerciseSession);

// Get today's exercise entries
exerciseRouter.get("/", getTodayExercises);

// Get exercise entries for a specific date
exerciseRouter.get("/:date", getExercisesByDate);

export { exerciseRouter };
