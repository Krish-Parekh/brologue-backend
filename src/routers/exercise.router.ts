import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { generateAndStoreWorkoutPlan, getUserWorkoutPlan, updateExerciseCompletion, updateExercisePlan } from "../controllers/exercise.controller";
const exerciseRouter = Router();

// All exercise routes require authentication
exerciseRouter.use(requireAuth);

// Get user's workout plan (must come before POST /plan route)
exerciseRouter.get("/plan", getUserWorkoutPlan);

// Generate and store workout plan (must come before /:date route)
exerciseRouter.post("/plan", generateAndStoreWorkoutPlan);

// Update exercise sets/reps in plan
exerciseRouter.patch("/plan", updateExercisePlan);

// Update exercise completion (sets/reps)
exerciseRouter.patch("/plan/exercises", updateExerciseCompletion);

export { exerciseRouter };
