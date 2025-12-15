import { Router } from "express";
import {
	generateAndStoreWorkoutPlan,
	getUserWorkoutPlan,
	updateExerciseCompletion,
	updateExercisePlan,
} from "../controllers/exercise.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import {
	generateAndStoreWorkoutPlanRequestSchema,
	updateExerciseCompletionRequestSchema,
	updateExercisePlanRequestSchema,
} from "../types/exercise.types";
import { asyncHandler } from "../utils/asyncHandler";

const exerciseRouter = Router();

// All exercise routes require authentication
exerciseRouter.use(requireAuth);

// Get user's workout plan (must come before POST /plan route)
exerciseRouter.get("/plan", asyncHandler(getUserWorkoutPlan));

// Generate and store workout plan (must come before /:date route)
exerciseRouter.post(
	"/plan",
	validateBody(generateAndStoreWorkoutPlanRequestSchema),
	asyncHandler(generateAndStoreWorkoutPlan),
);

// Update exercise sets/reps in plan
exerciseRouter.patch(
	"/plan",
	validateBody(updateExercisePlanRequestSchema),
	asyncHandler(updateExercisePlan),
);

// Update exercise completion (sets/reps)
exerciseRouter.patch(
	"/plan/exercises",
	validateBody(updateExerciseCompletionRequestSchema),
	asyncHandler(updateExerciseCompletion),
);

export { exerciseRouter };
