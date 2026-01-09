import { randomUUID } from "crypto";
import { and, eq, max, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { db } from "../db";
import { workoutExerciseCompletions } from "../db/schema/workout_exercise_completions";
import { workoutPlans } from "../db/schema/workout_plans";
import type {
	GenerateExercisePlanResponseData,
	GetWorkoutPlanResponseData,
	GenerateAndStoreWorkoutPlanResponseData,
	WorkoutExerciseCompletionData,
	WorkoutPlanData,
	WorkoutPlan,
} from "../types/exercise.types";
import {
	generateAndStoreWorkoutPlanRequestSchema,
	updateExerciseCompletionRequestSchema,
	updateExercisePlanRequestSchema,
} from "../types/exercise.types";
import type { ApiResponse } from "../types/response";
import { generateExercisePlanWithAI } from "../utils/ai";
import { transformToWorkoutPlan } from "../utils/exercise";
import { checkAndAwardBadges } from "../utils/badges";
import Logger from "../utils/logger";

export const generateAndStoreWorkoutPlan = async (
	request: Request,
	response: Response,
) => {
	const { userId } = request;
	const { goal, fitnessLevel, frequency, workoutType } =
		generateAndStoreWorkoutPlanRequestSchema.parse(request.body);

	const content = await generateExercisePlanWithAI(
		goal,
		fitnessLevel,
		frequency,
	);

	// Transform the AI response to WorkoutPlan format
	const workoutPlan = transformToWorkoutPlan(content, workoutType);

	let storedPlan;
	try {
		// Check if user already has a workout plan (user_id is unique)
		const existingPlan = await db
			.select()
			.from(workoutPlans)
			.where(eq(workoutPlans.userId, userId))
			.limit(1);

		if (existingPlan[0]) {
			// Update existing plan
			[storedPlan] = await db
				.update(workoutPlans)
				.set({
					goal,
					fitnessLevel,
					frequency,
					workoutType,
					planData: content,
					workoutPlan: workoutPlan as any,
					updatedAt: new Date(),
				})
				.where(eq(workoutPlans.userId, userId))
				.returning();
		} else {
			// Create new plan
			[storedPlan] = await db
				.insert(workoutPlans)
				.values({
					userId,
					goal,
					fitnessLevel,
					frequency,
					workoutType,
					planData: content,
					workoutPlan: workoutPlan as any,
				})
				.returning();
		}

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
	} catch (error) {
		Logger.error(
			`[generateAndStoreWorkoutPlan] Database error for userId: ${userId}`,
			error,
		);
		const apiResponse: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message:
				error instanceof Error
					? `Failed to store workout plan: ${error.message}`
					: "Failed to store workout plan",
			data: null,
		};
		return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(apiResponse);
	}

	const apiResponse: ApiResponse<GenerateAndStoreWorkoutPlanResponseData> = {
		code: StatusCodes.OK,
		message: "Workout plan generated and stored successfully",
		data: {
			id: storedPlan.id,
			workoutPlan: storedPlan.workoutPlan as WorkoutPlan,
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

	// Get all completions for this plan (needed for response data)
	const completions = await db
		.select()
		.from(workoutExerciseCompletions)
		.where(eq(workoutExerciseCompletions.planId, plan.id));

	// Optimized: Get count and max level directly from database
	const statsResult = await db
		.select({
			count: sql<number>`cast(count(*) as integer)`,
			maxLevel: max(workoutExerciseCompletions.levelNumber),
		})
		.from(workoutExerciseCompletions)
		.where(eq(workoutExerciseCompletions.planId, plan.id));

	const completedExercises = statsResult[0]?.count ?? 0;
	const maxLevel = statsResult[0]?.maxLevel ?? null;

	// Handle legacy plans that might not have workoutPlan stored
	let workoutPlanData: WorkoutPlan;
	if (plan.workoutPlan) {
		workoutPlanData = plan.workoutPlan as WorkoutPlan;
	} else {
		// Fallback: transform from planData if workoutPlan doesn't exist (backward compatibility)
		const planData = plan.planData as GenerateExercisePlanResponseData;
		const defaultWorkoutType = plan.workoutType || "Strength training";
		workoutPlanData = transformToWorkoutPlan(planData, defaultWorkoutType);
	}

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
		plan: {
			id: plan.id,
			workoutPlan: workoutPlanData,
			createdAt: plan.createdAt,
			updatedAt: plan.updatedAt,
		},
		completions: completionData,
		statistics: {
			goalCompletionPercentage: 0, // Can be calculated if needed
			totalExercises: 0, // Can be calculated if needed
			completedExercises,
			currentLevel: maxLevel ?? 0,
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
				id: randomUUID(),
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

	// Check and award badges (only if completion was successful and not deleted)
	if (completion.completedSets > 0 || completion.completedReps > 0) {
		try {
			const newlyEarnedBadges = await checkAndAwardBadges(userId, {
				completedAt: completion.completedAt,
				completedReps: completion.completedReps,
			});

			// Include newly earned badges in response if any
			if (newlyEarnedBadges.length > 0) {
				const apiResponse: ApiResponse<
					WorkoutExerciseCompletionData & { newlyEarnedBadges?: string[] }
				> = {
					code: StatusCodes.OK,
					message: "Exercise completion updated successfully",
					data: {
						...completion,
						newlyEarnedBadges,
					},
				};
				return response.status(StatusCodes.OK).json(apiResponse);
			}
		} catch (error) {
			// Log error but don't fail the request if badge checking fails
			Logger.error(
				`[updateExerciseCompletion] Badge checking failed for userId: ${userId}`,
				error,
			);
		}
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

	// Re-transform the workoutPlan since planData changed
	const workoutType = plan.workoutType || "Strength training";
	const updatedWorkoutPlan = transformToWorkoutPlan(planData, workoutType);

	// Update the plan in the database
	const [updated] = await db
		.update(workoutPlans)
		.set({
			planData: planData as any,
			workoutPlan: updatedWorkoutPlan as any,
			updatedAt: new Date(),
		})
		.where(eq(workoutPlans.id, plan.id))
		.returning();

	if (!updated) {
		throw new Error("Failed to update workout plan");
	}

	const apiResponse: ApiResponse<GenerateAndStoreWorkoutPlanResponseData> = {
		code: StatusCodes.OK,
		message: "Exercise plan updated successfully",
		data: {
			id: updated.id,
			workoutPlan: updated.workoutPlan as WorkoutPlan,
			createdAt: updated.createdAt,
			updatedAt: updated.updatedAt,
		},
	};
	return response.status(StatusCodes.OK).json(apiResponse);
};
