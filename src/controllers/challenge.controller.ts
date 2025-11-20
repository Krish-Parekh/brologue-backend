import type { Request, Response } from "express";
import { challengeWeeks } from "../data/challenge";
import type { ApiResponse } from "../types/response";
import type { Week } from "../types/challenge";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { z } from "zod";
import { getAuth } from "@clerk/express";

const weekRequestSchema = z
	.object({
		weekId: z.string().transform((val) => parseInt(val)),
	})
	.strict();

const dayRequestSchema = z
	.object({
		weekId: z.string().transform((val) => parseInt(val)),
		dayNumber: z.string().transform((val) => parseInt(val)),
	})
	.strict();

export const getAllWeeks = async (_req: Request, res: Response) => {
	try {
		const weeks = challengeWeeks.map((week) => {
			return {
				id: week.id,
				title: week.title,
				theme: week.theme,
				unlocked: week.unlocked,
			};
		});
		const response: ApiResponse<typeof weeks> = {
			code: StatusCodes.OK,
			message: "Challenges fetched successfully",
			data: weeks,
		};
		return res.status(StatusCodes.OK).json(response);
	} catch (error) {
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

export const getWeek = async (req: Request, res: Response) => {
	try {
		const { success, data } = weekRequestSchema.safeParse(req.params);
		if (!success) {
			const response: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: ReasonPhrases.BAD_REQUEST,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(response);
		}
		const { weekId } = data;
		const week = challengeWeeks.find((week) => week.id === weekId);
		if (!week) {
			const response: ApiResponse<null> = {
				code: StatusCodes.NOT_FOUND,
				message: "Week not found",
			};
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const response: ApiResponse<Week> = {
			code: StatusCodes.OK,
			message: "Week fetched successfully",
			data: week,
		};
		return res.status(StatusCodes.OK).json(response);
	} catch (error) {
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: "Failed to get week",
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

export const getDay = async (req: Request, res: Response) => {
	try {
		const { success, data } = dayRequestSchema.safeParse(req.params);
		if (!success) {
			const response: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: ReasonPhrases.BAD_REQUEST,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(response);
		}
		const { weekId, dayNumber } = data;
		const week = challengeWeeks.find((week) => week.id === weekId);
		if (!week) {
			const response: ApiResponse<null> = {
				code: StatusCodes.NOT_FOUND,
				message: "Week not found",
			};
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}
		const prompts = week.prompts.find((prompt) => prompt.day === dayNumber);
		const mantras = week.mantras.find((mantra) => mantra.day === dayNumber);
		const payload = {
			day: dayNumber,
			title: week.title,
			description: week.description,
			prompts,
			mantras,
		};
		const response: ApiResponse<typeof payload> = {
			code: StatusCodes.OK,
			message: "Day fetched successfully",
			data: payload,
		};

		return res.status(StatusCodes.OK).json(response);
	} catch (error) {
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

const dailyProgressParamSchema = z
	.object({
		weekId: z.string().transform((val) => parseInt(val)),
		dayNumber: z.string().transform((val) => parseInt(val)),
	})
	.strict();

export const createDailyProgress = async (req: Request, res: Response) => {
	try {
		const { success, data } = dailyProgressParamSchema.safeParse(req.params);
		if (!success) {
			const response: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: ReasonPhrases.BAD_REQUEST,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(response);
		}
		const { weekId, dayNumber } = data;
		const { userId } = getAuth(req);
		if (!userId) {
			const response: ApiResponse<null> = {
				code: StatusCodes.UNAUTHORIZED,
				message: ReasonPhrases.UNAUTHORIZED,
			};
			return res.status(StatusCodes.UNAUTHORIZED).json(response);
		}
	}
	catch (error) {
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
}
