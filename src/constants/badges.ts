/**
 * Badge definitions - hardcoded constants
 * These badges are awarded based on exercise achievements
 */

export enum BadgeCriteriaType {
	FIRST_WORKOUT = "FIRST_WORKOUT",
	WORKOUT_COUNT = "WORKOUT_COUNT",
	EARLY_BIRD = "EARLY_BIRD",
	NIGHT_OWL = "NIGHT_OWL",
	FIRST_REP = "FIRST_REP",
	TOTAL_REPS = "TOTAL_REPS",
}

export interface BadgeDefinition {
	id: string;
	name: string;
	description: string;
	icon: string;
	criteriaType: BadgeCriteriaType;
	criteriaValue?: number; // Threshold value for count-based badges
}

export const BADGES: Record<string, BadgeDefinition> = {
	// ============================================
	// FIRST TIME BADGES
	// ============================================
	FIRST_STEP: {
		id: "first_step",
		name: "First Step",
		description: "Complete your first workout",
		icon: "🎯",
		criteriaType: BadgeCriteriaType.FIRST_WORKOUT,
	},
	FIRST_REP: {
		id: "first_rep",
		name: "First Rep",
		description: "Complete your first repetition of any exercise",
		icon: "💪",
		criteriaType: BadgeCriteriaType.FIRST_REP,
	},

	// ============================================
	// TIME-BASED BADGES
	// ============================================
	EARLY_BIRD: {
		id: "early_bird",
		name: "Early Bird",
		description: "Complete a workout before 6 AM",
		icon: "🌅",
		criteriaType: BadgeCriteriaType.EARLY_BIRD,
	},
	NIGHT_OWL: {
		id: "night_owl",
		name: "Night Owl",
		description: "Complete a workout after 8 PM",
		icon: "🦉",
		criteriaType: BadgeCriteriaType.NIGHT_OWL,
	},

	// ============================================
	// WORKOUT COUNT BADGES
	// ============================================
	ON_THE_ROLL: {
		id: "on_the_roll",
		name: "On The Roll",
		description: "Complete 5 workouts total",
		icon: "🔥",
		criteriaType: BadgeCriteriaType.WORKOUT_COUNT,
		criteriaValue: 5,
	},
	DOUBLE_DIGITS: {
		id: "double_digits",
		name: "Double Digits",
		description: "Complete 10 workouts total",
		icon: "🔟",
		criteriaType: BadgeCriteriaType.WORKOUT_COUNT,
		criteriaValue: 10,
	},
	QUARTER_CENTURY: {
		id: "quarter_century",
		name: "Quarter Century",
		description: "Complete 25 workouts total",
		icon: "🎖️",
		criteriaType: BadgeCriteriaType.WORKOUT_COUNT,
		criteriaValue: 25,
	},
	HALFWAY_THERE: {
		id: "halfway_there",
		name: "Halfway There",
		description: "Complete 50 workouts total",
		icon: "⚡",
		criteriaType: BadgeCriteriaType.WORKOUT_COUNT,
		criteriaValue: 50,
	},
	CENTURY_CLUB: {
		id: "century_club",
		name: "Century Club",
		description: "Complete 100 workouts",
		icon: "💯",
		criteriaType: BadgeCriteriaType.WORKOUT_COUNT,
		criteriaValue: 100,
	},
	DEDICATED: {
		id: "dedicated",
		name: "Dedicated",
		description: "Complete 250 workouts total",
		icon: "🏅",
		criteriaType: BadgeCriteriaType.WORKOUT_COUNT,
		criteriaValue: 250,
	},
	WORKOUT_WARRIOR: {
		id: "workout_warrior",
		name: "Workout Warrior",
		description: "Complete 500 workouts total",
		icon: "⚔️",
		criteriaType: BadgeCriteriaType.WORKOUT_COUNT,
		criteriaValue: 500,
	},

	// ============================================
	// TOTAL REPS BADGES (Meaningful thresholds)
	// ============================================
	IRON_STARTER: {
		id: "iron_starter",
		name: "Iron Starter",
		description: "Complete 50 cumulative reps",
		icon: "⭐",
		criteriaType: BadgeCriteriaType.TOTAL_REPS,
		criteriaValue: 50,
	},
	CENTURY_REPS: {
		id: "century_reps",
		name: "Century Reps",
		description: "Complete 100 cumulative reps",
		icon: "🌟",
		criteriaType: BadgeCriteriaType.TOTAL_REPS,
		criteriaValue: 100,
	},
	REP_MACHINE: {
		id: "rep_machine",
		name: "Rep Machine",
		description: "Complete 500 cumulative reps",
		icon: "🤖",
		criteriaType: BadgeCriteriaType.TOTAL_REPS,
		criteriaValue: 500,
	},
	THOUSAND_STRONG: {
		id: "thousand_strong",
		name: "Thousand Strong",
		description: "Complete 1,000 cumulative reps",
		icon: "💎",
		criteriaType: BadgeCriteriaType.TOTAL_REPS,
		criteriaValue: 1000,
	},
	REP_LEGEND: {
		id: "rep_legend",
		name: "Rep Legend",
		description: "Complete 5,000 cumulative reps",
		icon: "🏆",
		criteriaType: BadgeCriteriaType.TOTAL_REPS,
		criteriaValue: 5000,
	},
	THE_BEAST: {
		id: "the_beast",
		name: "The Beast",
		description: "Complete 10,000 cumulative reps",
		icon: "🦁",
		criteriaType: BadgeCriteriaType.TOTAL_REPS,
		criteriaValue: 10000,
	},
} as const;

export type BadgeId = (typeof BADGES)[keyof typeof BADGES]["id"];

// Array of all badges for easy iteration
export const ALL_BADGES = Object.values(BADGES);
