import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";

const exerciseRouter = Router();

// All exercise routes require authentication
exerciseRouter.use(requireAuth);

// // Generate and store workout plan (must come before /:date route)
// exerciseRouter.post("/plan", generateAndStoreWorkoutPlan);

// // Get user's workout plan with completions and statistics (must come before /:date route)
// exerciseRouter.get("/plan", getUserWorkoutPlan);

// // Update exercise completion (sets/reps)
// exerciseRouter.patch("/plan/exercises", updateExerciseCompletion);

export { exerciseRouter };
