export type MantraType = "daily" | "weekly";
export type PromptType = "daily" | "weekly";

export interface DailyChallenge {
	day: number;
	title: string;
	description: string;
	actionItems: string[];
}

export interface FocusArea {
	id: string;
	title: string;
	description: string;
	dailyChallenges: DailyChallenge[];
}

export interface Mantra {
	id: string;
	text: string;
	type: MantraType;
	day?: number;
}

export interface Prompt {
	id: string;
	text: string;
	type: PromptType;
	day?: number;
}

export interface Week {
	id: number;
	title: string;
	theme: string;
	description: string;
	unlocked: boolean;
	focusAreas: FocusArea[];
	mantras: Mantra[];
	prompts: Prompt[];
}
