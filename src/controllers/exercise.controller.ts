import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { db } from "../db";
import { workoutExerciseCompletions } from "../db/schema/workout_exercise_completions";
import { workoutPlans } from "../db/schema/workout_plans";
import type {
	GenerateExercisePlanResponseData,
	GetWorkoutPlanResponseData,
	WorkoutExerciseCompletionData,
	WorkoutPlanData,
} from "../types/exercise.types";
import {
	generateAndStoreWorkoutPlanRequestSchema,
	updateExerciseCompletionRequestSchema,
	updateExercisePlanRequestSchema,
} from "../types/exercise.types";
import type { ApiResponse } from "../types/response";
import { generateExercisePlanWithAI } from "../utils/ai";
import Logger from "../utils/logger";

export const generateAndStoreWorkoutPlan = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	const { goal, fitnessLevel, frequency } =
		generateAndStoreWorkoutPlanRequestSchema.parse(request.body);

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
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse);
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
};

export const getUserWorkoutPlan = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	const existingPlan = await db
		.select()
		.from(workoutPlans)
		.where(eq(workoutPlans.userId, userId))
		.limit(1);

	const plan = existingPlan[0];
	if (!plan) {
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.NOT_FOUND,
			message: "No workout plan found for user",
			data: null,
		};
		return response.status(StatusCodes.NOT_FOUND).json(apiResponse);
	}

	// Get all completions for this plan
	const completions = await db
		.select()
		.from(workoutExerciseCompletions)
		.where(eq(workoutExerciseCompletions.planId, plan.id));

	const planData: WorkoutPlanData = {
		id: plan.id,
		userId: plan.userId,
		goal: plan.goal,
		fitnessLevel: plan.fitnessLevel as "beginner" | "intermediate" | "advanced",
		frequency: plan.frequency,
		planData: plan.planData as GenerateExercisePlanResponseData,
		createdAt: plan.createdAt,
		updatedAt: plan.updatedAt,
	};

	const completionData: WorkoutExerciseCompletionData[] = completions.map(
		(c) => ({
			id: c.id,
			userId: c.userId,
			planId: c.planId,
			levelNumber: c.levelNumber,
			exerciseName: c.exerciseName,
			plannedSets: c.plannedSets,
			plannedReps: c.plannedReps,
			completedSets: c.completedSets,
			completedReps: c.completedReps,
			completedAt: c.completedAt,
			createdAt: c.createdAt,
			updatedAt: c.updatedAt,
		}),
	);

	const responseData: GetWorkoutPlanResponseData = {
		plan: planData,
		completions: completionData,
		statistics: {
			goalCompletionPercentage: 0, // Can be calculated if needed
			totalExercises: 0, // Can be calculated if needed
			completedExercises: completionData.length,
			currentLevel:
				completionData.length > 0
					? Math.max(...completionData.map((c) => c.levelNumber))
					: 0,
		},
	};

	const apiResponse: ApiResponse<GetWorkoutPlanResponseData> = {
		code: StatusCodes.OK,
		message: "Workout plan retrieved successfully",
		data: responseData,
	};
	return response.status(StatusCodes.OK).json(apiResponse);
};

export const updateExerciseCompletion = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	const { levelNumber, exerciseName, completedSets, completedReps } =
		updateExerciseCompletionRequestSchema.parse(request.body);

	// First, get the user's workout plan to get the planId
	const existingPlan = await db
		.select()
		.from(workoutPlans)
		.where(eq(workoutPlans.userId, userId))
		.limit(1);

	const plan = existingPlan[0];
	if (!plan) {
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.NOT_FOUND,
			message: "No workout plan found for user",
			data: null,
		};
		return response.status(StatusCodes.NOT_FOUND).json(apiResponse);
	}

	// Find the exercise in the plan to get planned sets/reps
	const planData = plan.planData as GenerateExercisePlanResponseData;
	const level = planData.levels.find((l) => l.levelNumber === levelNumber);
	if (!level) {
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.BAD_REQUEST,
			message: `Level ${levelNumber} not found in workout plan`,
			data: null,
		};
		return response.status(StatusCodes.BAD_REQUEST).json(apiResponse);
	}

	const exercise = level.exercises.find((e) => e.name === exerciseName);
	if (!exercise) {
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.BAD_REQUEST,
			message: `Exercise "${exerciseName}" not found in level ${levelNumber}`,
			data: null,
		};
		return response.status(StatusCodes.BAD_REQUEST).json(apiResponse);
	}

	// Check if completion already exists
	const existingCompletion = await db
		.select()
		.from(workoutExerciseCompletions)
		.where(
			and(
				eq(workoutExerciseCompletions.userId, userId),
				eq(workoutExerciseCompletions.planId, plan.id),
				eq(workoutExerciseCompletions.levelNumber, levelNumber),
				eq(workoutExerciseCompletions.exerciseName, exerciseName),
			),
		)
		.limit(1);

	let completion: WorkoutExerciseCompletionData;

	if (existingCompletion[0]) {
		// Update existing completion
		// If completedSets/completedReps are 0, delete the completion (mark as undone)
		if (completedSets === 0 && completedReps === 0) {
			await db
				.delete(workoutExerciseCompletions)
				.where(eq(workoutExerciseCompletions.id, existingCompletion[0].id));

			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.OK,
				message: "Exercise completion removed successfully",
				data: null,
			};
			return response.status(StatusCodes.OK).json(apiResponse);
		}

		const [updated] = await db
			.update(workoutExerciseCompletions)
			.set({
				completedSets,
				completedReps,
				completedAt: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(workoutExerciseCompletions.id, existingCompletion[0].id))
			.returning();

		if (!updated) {
			throw new Error("Failed to update exercise completion");
		}

		completion = {
			id: updated.id,
			userId: updated.userId,
			planId: updated.planId,
			levelNumber: updated.levelNumber,
			exerciseName: updated.exerciseName,
			plannedSets: updated.plannedSets,
			plannedReps: updated.plannedReps,
			completedSets: updated.completedSets,
			completedReps: updated.completedReps,
			completedAt: updated.completedAt,
			createdAt: updated.createdAt,
			updatedAt: updated.updatedAt,
		};
	} else {
		// Create new completion
		if (completedSets === 0 && completedReps === 0) {
			// Nothing to create if both are 0
			const apiResponse: ApiResponse<null> = {
				code: StatusCodes.OK,
				message: "Exercise completion removed successfully",
				data: null,
			};
			return response.status(StatusCodes.OK).json(apiResponse);
		}

		const [created] = await db
			.insert(workoutExerciseCompletions)
			.values({
				id: crypto.randomUUID(),
				userId,
				planId: plan.id,
				levelNumber,
				exerciseName,
				plannedSets: exercise.sets,
				plannedReps: exercise.reps,
				completedSets,
				completedReps,
				completedAt: new Date(),
			})
			.returning();

		if (!created) {
			throw new Error("Failed to create exercise completion");
		}

		completion = {
			id: created.id,
			userId: created.userId,
			planId: created.planId,
			levelNumber: created.levelNumber,
			exerciseName: created.exerciseName,
			plannedSets: created.plannedSets,
			plannedReps: created.plannedReps,
			completedSets: created.completedSets,
			completedReps: created.completedReps,
			completedAt: created.completedAt,
			createdAt: created.createdAt,
			updatedAt: created.updatedAt,
		};
	}

	const apiResponse: ApiResponse<WorkoutExerciseCompletionData> = {
		code: StatusCodes.OK,
		message: "Exercise completion updated successfully",
		data: completion,
	};
	return response.status(StatusCodes.OK).json(apiResponse);
};

export const updateExercisePlan = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	const { levelNumber, exerciseName, sets, reps } =
		updateExercisePlanRequestSchema.parse(request.body);

	// Get the user's workout plan
	const existingPlan = await db
		.select()
		.from(workoutPlans)
		.where(eq(workoutPlans.userId, userId))
		.limit(1);

	const plan = existingPlan[0];
	if (!plan) {
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.NOT_FOUND,
			message: "No workout plan found for user",
			data: null,
		};
		return response.status(StatusCodes.NOT_FOUND).json(apiResponse);
	}

	// Update the planData
	const planData = plan.planData as GenerateExercisePlanResponseData;
	const level = planData.levels.find((l) => l.levelNumber === levelNumber);
	if (!level) {
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.BAD_REQUEST,
			message: `Level ${levelNumber} not found in workout plan`,
			data: null,
		};
		return response.status(StatusCodes.BAD_REQUEST).json(apiResponse);
	}

	const exercise = level.exercises.find((e) => e.name === exerciseName);
	if (!exercise) {
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.BAD_REQUEST,
			message: `Exercise "${exerciseName}" not found in level ${levelNumber}`,
			data: null,
		};
		return response.status(StatusCodes.BAD_REQUEST).json(apiResponse);
	}

	// Update the exercise sets and reps
	exercise.sets = sets;
	exercise.reps = reps;

	// Update the plan in the database
	const [updated] = await db
		.update(workoutPlans)
		.set({
			planData: planData as any,
			updatedAt: new Date(),
		})
		.where(eq(workoutPlans.id, plan.id))
		.returning();

	if (!updated) {
		throw new Error("Failed to update workout plan");
	}

	const apiResponse: ApiResponse<WorkoutPlanData> = {
		code: StatusCodes.OK,
		message: "Exercise plan updated successfully",
		data: {
			id: updated.id,
			userId: updated.userId,
			goal: updated.goal,
			fitnessLevel: updated.fitnessLevel as
				| "beginner"
				| "intermediate"
				| "advanced",
			frequency: updated.frequency,
			planData: updated.planData as GenerateExercisePlanResponseData,
			createdAt: updated.createdAt,
			updatedAt: updated.updatedAt,
		},
	};
	return response.status(StatusCodes.OK).json(apiResponse);
};
