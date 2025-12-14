import type { Request, Response } from "express";
import { z } from "zod";
import Logger from "../utils/logger";
import type { ApiResponse } from "../types/response";
import { StatusCodes } from "http-status-codes";
import { generateExercisePlanWithAI } from "../utils/ai";


const generateAndStoreWorkoutPlanRequestSchema = z
	.object({
		goal: z.string().min(1, "Goal is required"),
		fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
		frequency: z.number().int().min(1, "Frequency must be at least 1 day per week").max(7, "Frequency cannot exceed 7 days per week"),
	})
	.strict();


export const generateAndStoreWorkoutPlan = async (request: Request, response: Response) => {
	try {
		const { userId } = request;
		const validationResult = generateAndStoreWorkoutPlanRequestSchema.safeParse(request.body);
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

		const content = await generateExercisePlanWithAI(goal, fitnessLevel, frequency);

		


	} catch (error) { }
}