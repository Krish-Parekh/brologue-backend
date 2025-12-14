import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { db } from "../db";
import { workoutPlans } from "../db/schema/workout_plans";
import type {
	GenerateExercisePlanResponseData,
	WorkoutPlanData,
} from "../types/exercise.types";
import type { ApiResponse } from "../types/response";
import { generateExercisePlanWithAI } from "../utils/ai";
import Logger from "../utils/logger";

const generateAndStoreWorkoutPlanRequestSchema = z
	.object({
		goal: z.string().min(1, "Goal is required"),
		fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
		frequency: z
			.number()
			.int()
			.min(1, "Frequency must be at least 1 day per week")
			.max(7, "Frequency cannot exceed 7 days per week"),
	})
	.strict();

export const generateAndStoreWorkoutPlan = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	try {
		const validationResult = generateAndStoreWorkoutPlanRequestSchema.safeParse(
			request.body,
		);
		if (!validationResult.success) {
			Logger.warn(
				`[generateAndStoreWorkoutPlan] Validation failed for userId: ${userId}, errors: ${JSON.stringify(validationResult.error.issues)}`,
			);
			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: "Invalid request body",
				data: null,
			};
			return response.status(StatusCodes.BAD_REQUEST).json(apiResponse);
		}

		const { goal, fitnessLevel, frequency } = validationResult.data;

		const content = await generateExercisePlanWithAI(
			goal,
			fitnessLevel,
			frequency,
		);

		const [storedPlan] = await db
			.insert(workoutPlans)
			.values({
				userId,
				goal,
				fitnessLevel,
				frequency,
				planData: content,
			})
			.returning();

		if (!storedPlan) {
			Logger.error(
				`[generateAndStoreWorkoutPlan] No plan stored for userId: ${userId}`,
			);
			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.INTERNAL_SERVER_ERROR,
				message: "Failed to store workout plan",
				data: null,
			};
			return response
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.json(apiResponse);
		}
		const apiResponse: ApiResponse<WorkoutPlanData> = {
			code: StatusCodes.OK,
			message: "Workout plan generated and stored successfully",
			data: {
				id: storedPlan.id,
				userId: storedPlan.userId,
				goal: storedPlan.goal,
				fitnessLevel: storedPlan.fitnessLevel as
					| "beginner"
					| "intermediate"
					| "advanced",
				frequency: storedPlan.frequency,
				planData: storedPlan.planData as GenerateExercisePlanResponseData,
				createdAt: storedPlan.createdAt,
				updatedAt: storedPlan.updatedAt,
			},
		};
		return response.status(StatusCodes.OK).json(apiResponse);
	} catch (error) {
		Logger.error(
			`[generateAndStoreWorkoutPlan] Error generating and storing workout plan for userId: ${userId}, error: ${error instanceof Error ? error.message : String(error)}`,
		);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: "Failed to generate and store workout plan",
			data: null,
		};
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse);
	}
};
