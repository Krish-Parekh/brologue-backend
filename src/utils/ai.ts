import Groq from "groq-sdk";
import { z } from "zod";
import type { GenerateExercisePlanResponseData } from "../types/exercise.types";
import { env } from "./env";
import Logger from "./logger";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

const exerciseSchema = z
	.object({
		name: z.enum([
			"Push-ups",
			"Squats",
			"Lunges",
			"Plank",
			"Burpees",
			"Mountain Climbers",
			"Jumping Jacks",
			"High Knees",
			"Glute Bridges",
			"Tricep Dips",
			"Wall Sit",
			"Calf Raises",
			"Russian Twists",
			"Bicycle Crunches",
			"Dead Bug",
			"Bird Dog",
			"Superman",
			"Side Plank",
			"Bear Crawl",
			"Inchworm",
		]),
		sets: z.number().int().positive("Sets must be a positive integer"),
		reps: z.number().int().positive("Reps must be a positive integer"),
		restSeconds: z
			.number()
			.int()
			.positive("Rest seconds must be a positive integer"),
		instructions: z.string().min(1, "Instructions are required"),
	})
	.strict();

const levelSchema = z
	.object({
		levelNumber: z
			.number()
			.int()
			.min(1, "Level number must be at least 1")
			.max(5, "Level number must be at most 5"),
		difficulty: z.string().min(1, "Difficulty description is required"),
		exercises: z
			.array(exerciseSchema)
			.length(5, "Exactly 5 exercises required"),
	})
	.strict();

export const exercisePlanResponseSchema = z
	.object({
		goal: z.string().min(1, "Goal is required"),
		fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
		frequency: z
			.number()
			.int()
			.min(1, "Frequency must be at least 1 day per week")
			.max(7, "Frequency cannot exceed 7 days per week"),
		levels: z.array(levelSchema).length(5, "Exactly 5 levels required"),
	})
	.strict();

const _generateExercisePlanRequestSchema = z
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

const getSystemMessage = (
	goal: string,
	fitnessLevel: string,
	frequency: number,
) => {
	return `You are an expert fitness coach specializing in home-based workout plans.

YOUR PRIMARY MISSION:
Generate a custom, progressive exercise plan tailored to help the user achieve their specific fitness goal: "${goal}".

USER PROFILE:
- Fitness Level: ${fitnessLevel}
- Training Frequency: ${frequency} days per week
- Environment: Home-based (no gym equipment required)

EXERCISE LIBRARY - USE THESE EXACT NAMES:

You MUST select exactly 5 exercises from the following predefined list. Use the EXACT names as specified below (case-sensitive):

STRENGTH & MUSCLE BUILDING EXERCISES:
- "Push-ups" (not "Pushups", "Push Ups", or "Pushup")
- "Bodyweight Squats" (not "Squats", "Body Squats", or "Air Squats")
- "Lunges" (not "Lunge", "Walking Lunges", or "Forward Lunges")
- "Plank" (not "Planks", "Front Plank", or "Plank Hold")
- "Glute Bridges" (not "Bridge", "Hip Bridge", or "Glute Bridge")
- "Wall Sit" (not "Wall Sits" or "Wall Squat")
- "Diamond Push-ups" (not "Diamond Pushups" or "Close-Grip Push-ups")
- "Pike Push-ups" (not "Pike Pushups" or "Incline Push-ups")
- "Single-Leg Glute Bridges" (not "Single Leg Bridge" or "One-Leg Bridge")

CARDIO & ENDURANCE EXERCISES:
- "Jumping Jacks" (not "Jumping Jack", "Star Jumps", or "Side Straddle Hops")
- "High Knees" (not "High Knee", "Running in Place", or "Knee Raises")
- "Burpees" (not "Burpee", "Squat Thrusts", or "Full Burpees")
- "Mountain Climbers" (not "Mountain Climber", "Running Plank", or "Climbers")
- "Jump Squats" (not "Jump Squat", "Squat Jumps", or "Explosive Squats")
- "Butt Kicks" (not "Butt Kick", "Heel Kicks", or "Hamstring Curls")
- "Skaters" (not "Skater", "Lateral Jumps", or "Side-to-Side Jumps")

CORE & FLEXIBILITY EXERCISES:
- "Crunches" (not "Crunch", "Ab Crunches", or "Sit-ups")
- "Bicycle Crunches" (not "Bicycle Crunch", "Bike Crunches", or "Bicycles")
- "Russian Twists" (not "Russian Twist", "Seated Twists", or "Torso Twists")
- "Leg Raises" (not "Leg Raise", "Straight Leg Raises", or "Hanging Leg Raises")
- "Dead Bug" (not "Dead Bugs", "Dead Bug Exercise", or "Opposite Arm Leg")
- "Superman" (not "Superman Hold", "Superman Exercise", or "Back Extension")
- "Cat-Cow Stretch" (not "Cat Cow", "Cat-Cow", or "Spinal Wave")

EXERCISE SELECTION RULES:

Based on the goal "${goal}", select exactly 5 exercises using these guidelines:

1. GOAL: "Lose weight" / "Fat loss" / "Weight loss"
   → Select: 2-3 cardio exercises + 2-3 strength exercises
   → Example: Jumping Jacks, Burpees, Bodyweight Squats, Push-ups, Plank

2. GOAL: "Build muscle" / "Gain muscle" / "Strength"
   → Select: 4-5 strength exercises + 0-1 core exercise
   → Example: Push-ups, Bodyweight Squats, Lunges, Glute Bridges, Plank

3. GOAL: "Improve endurance" / "Cardio fitness" / "Stamina"
   → Select: 3-4 cardio exercises + 1-2 strength exercises
   → Example: Jumping Jacks, High Knees, Burpees, Mountain Climbers, Bodyweight Squats

4. GOAL: "Increase flexibility" / "Mobility" / "Flexibility"
   → Select: 2-3 flexibility exercises + 2-3 strength exercises
   → Example: Cat-Cow Stretch, Leg Raises, Bodyweight Squats, Lunges, Plank

5. GOAL: "Core strength" / "Abs" / "Core"
   → Select: 3-4 core exercises + 1-2 strength exercises
   → Example: Plank, Crunches, Bicycle Crunches, Russian Twists, Push-ups

6. GOAL: "General fitness" / "Overall fitness" / "Mixed"
   → Select: 2 strength + 2 cardio + 1 core
   → Example: Push-ups, Bodyweight Squats, Jumping Jacks, Burpees, Plank

CRITICAL NAMING REQUIREMENTS:
- ALWAYS use the EXACT exercise names from the list above (case-sensitive)
- DO NOT create variations, abbreviations, or alternative names
- DO NOT combine exercise names (e.g., don't use "Push-up Variations")
- If an exercise has multiple names listed, use the FIRST one shown

PROGRESSIVE LEVEL STRUCTURE:
- Create exactly 5 progressive levels (Level 1 through Level 5)
- Level 1 must be the easiest/beginner-friendly version
- Level 5 must be the most challenging/advanced version
- Each level MUST use the SAME 5 exercises (do not change exercises between levels)
- Progression between levels MUST be achieved by increasing:
  * Number of sets (e.g., Level 1: 2 sets, Level 2: 3 sets, etc.)
  * Number of reps per set (e.g., Level 1: 8 reps, Level 2: 10 reps, etc.)
- Ensure smooth, gradual progression - avoid sudden jumps in difficulty
- Each level should feel achievable but challenging

PROGRESSION LOGIC:
- Level 1: Start with lower sets and reps appropriate for ${fitnessLevel} level
  * Beginner: 2 sets, 8-10 reps
  * Intermediate: 2-3 sets, 10-12 reps
  * Advanced: 3 sets, 12-15 reps
- Level 2-4: Gradually increase sets and/or reps
- Level 5: Maximum challenge level that still maintains proper form
- Rest periods: 30-45s for Level 1-2, 45-60s for Level 3-4, 60-90s for Level 5

SAFETY GUARDRAILS AND BEST PRACTICES:
- ALWAYS emphasize proper form and technique over speed or quantity
- Include clear, step-by-step instructions for each exercise to prevent injury
- Recommend a 5-10 minute warm-up before starting (light cardio, dynamic stretching)
- Recommend a 5-10 minute cool-down after completing (static stretching)
- Warn users to stop immediately if they experience pain (not just muscle fatigue)
- Advise users to consult with a healthcare provider before starting if they:
  * Have any pre-existing health conditions
  * Are recovering from an injury
  * Are pregnant or postpartum
  * Have not exercised regularly in the past
- Ensure all exercises are age-appropriate and health-conscious
- Include rest day recommendations (at least 1-2 rest days per week)
- Emphasize progressive overload principles: gradual increase, not sudden jumps
- Remind users that consistency is more important than intensity
- Include hydration reminders

OUTPUT REQUIREMENTS:
- Provide exactly 5 levels, each with exactly 5 exercises
- Each exercise must include: name (using EXACT names from the list above), sets, reps, restSeconds, and detailed instructions
- Instructions should be clear, actionable, and include form cues
- Difficulty descriptions should accurately reflect the progression

Remember: Your goal is to create a safe, effective, and progressive home workout plan that helps the user achieve "${goal}" while respecting their ${fitnessLevel} fitness level and ${frequency} days per week commitment. Use ONLY the exercise names specified above.`;
};
/**
 * Generate exercise plan using Groq AI
 * This is a reusable function that can be called from controllers
 */
export const generateExercisePlanWithAI = async (
	goal: string,
	fitnessLevel: "beginner" | "intermediate" | "advanced",
	frequency: number,
): Promise<GenerateExercisePlanResponseData> => {
	Logger.debug(
		`[generateExercisePlanWithAI] Generating plan for goal: ${goal}, fitnessLevel: ${fitnessLevel}, frequency: ${frequency}`,
	);

	const systemMessage = getSystemMessage(goal, fitnessLevel, frequency);
	const userMessage = `Generate a progressive home workout plan to help me achieve my goal: "${goal}". I am at ${fitnessLevel} fitness level and can train ${frequency} days per week.`;

	const maxRetries = 3;
	let content: GenerateExercisePlanResponseData | null = null;
	let lastValidationError: z.ZodError | null = null;

	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			const messages: Array<{ role: "system" | "user"; content: string }> = [
				{
					role: "system",
					content: systemMessage,
				},
				{
					role: "user",
					content: userMessage,
				},
			];

			// If this is a retry, add error feedback to help fix the JSON
			if (attempt > 0 && lastValidationError) {
				const errorMessages = lastValidationError.issues
					.map((err: z.core.$ZodIssue) => {
						const path = err.path.join(".");
						return `- ${path}: ${err.message}`;
					})
					.join("\n");

				messages.push({
					role: "user",
					content: `The previous JSON response failed validation. Please fix the following errors:\n\n${errorMessages}\n\nPlease regenerate the JSON response with all errors corrected.`,
				});
			}

			const groqResponse = await groq.chat.completions.create({
				model: "openai/gpt-oss-120b",
				messages,
				temperature: 0.7,
				max_completion_tokens: 8192,
				top_p: 1,
				stream: false,
				reasoning_effort: "medium",
				response_format: {
					type: "json_schema",
					json_schema: {
						name: "exercise_plan",
						schema: z.toJSONSchema(exercisePlanResponseSchema),
						strict: true,
					},
				},
			});

			const rawContent = groqResponse.choices[0]?.message?.content || "{}";

			// Parse JSON
			let parsedContent: any;
			try {
				parsedContent = JSON.parse(rawContent);
			} catch (parseError) {
				Logger.warn(
					`[generateExercisePlanWithAI] JSON parse error on attempt ${attempt + 1}/${maxRetries + 1}: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
				);
				if (attempt < maxRetries) {
					const issue: z.ZodIssue = {
						code: z.ZodIssueCode.custom,
						path: [],
						message: `Invalid JSON format: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
					};
					lastValidationError = new z.ZodError([issue]) as z.ZodError;
					continue;
				}
				throw parseError;
			}

			// Validate against schema
			const validationResult =
				exercisePlanResponseSchema.safeParse(parsedContent);

			if (!validationResult.success) {
				Logger.warn(
					`[generateExercisePlanWithAI] Validation failed on attempt ${attempt + 1}/${maxRetries + 1}, errors: ${JSON.stringify(validationResult.error.issues)}`,
				);
				lastValidationError = validationResult.error;

				if (attempt < maxRetries) {
					continue; // Retry with error feedback
				} else {
					// Max retries reached, throw validation error
					throw new Error(
						`Validation failed after ${maxRetries + 1} attempts: ${JSON.stringify(validationResult.error.issues)}`,
					);
				}
			}

			// Validation successful
			content = validationResult.data;
			break;
		} catch (error) {
			// If it's not a validation error we're handling, or if we've exhausted retries
			if (attempt === maxRetries) {
				throw error;
			}
			// For other errors, log and retry
			Logger.warn(
				`[generateExercisePlanWithAI] Error on attempt ${attempt + 1}/${maxRetries + 1}: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	if (!content) {
		throw new Error("Failed to generate valid exercise plan after all retries");
	}

	return content;
};
