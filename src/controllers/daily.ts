import type { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { z } from "zod";
import type { ApiResponse } from "../types/response";

const dailyProgressRequestSchema = z
	.object({
		weekId: z.string().transform((val) => parseInt(val)),
		dayNumber: z.string().transform((val) => parseInt(val)),
		notes: z.string().optional(),
	})
	.strict();

export const createDailyProgress = async (req: Request, res: Response) => {
	try {
		const { success, data } = dailyProgressRequestSchema.safeParse(req.body);
		if (!success) {
			const response: ApiResponse<null> = {
				code: StatusCodes.BAD_REQUEST,
				message: ReasonPhrases.BAD_REQUEST,
			};
			return res.status(StatusCodes.BAD_REQUEST).json(response);
		}
		const { weekId, dayNumber, notes } = data;
		//
	} catch (error) {
		const response: ApiResponse<null> = {
			code: StatusCodes.INTERNAL_SERVER_ERROR,
			message: ReasonPhrases.INTERNAL_SERVER_ERROR,
		};
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
