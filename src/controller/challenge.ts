import type { Request, Response } from "express";
import { challengeWeeks } from "../data/challenge";
import type { ApiResponse } from "../types/response";
import type { Week } from "../types/challenge";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const weekRequestSchema = z.object({
    weekId: z.number().int().positive(),
}).strict();

const dayRequestSchema = z.object({
    weekId: z.number().int().positive(),
    dayNumber: z.number().int().positive(),
}).strict();

export const getAllWeeks = async (_req: Request, res: Response) => {
    try {
        const weeks = challengeWeeks.map((week) => {
            return {
                id: week.id,
                title: week.title,
                theme: week.theme
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
            message: "Failed to get challenges",
        };
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
}

export const getWeek = async (req: Request, res: Response) => {
    try {
        const { success, data } = weekRequestSchema.safeParse(req.params);
        if (!success) {
            const response: ApiResponse<null> = {
                code: StatusCodes.BAD_REQUEST,
                message: "Invalid request",
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
}

export const getDay = async (req: Request, res: Response) => {
    try {
        const { success, data } = dayRequestSchema.safeParse(req.params);
        if (!success) {
            const response: ApiResponse<null> = {
                code: StatusCodes.BAD_REQUEST,
                message: "Invalid request",
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
        const day = week.focusAreas.find((focusArea) => focusArea.dailyChallenges.find((challenge) => challenge.day === dayNumber));
        if (!day) {
            const response: ApiResponse<null> = {
                code: StatusCodes.NOT_FOUND,
                message: "Challenge not found",
            };
            return res.status(StatusCodes.NOT_FOUND).json(response);
        }
        const response: ApiResponse<typeof day> = {
            code: StatusCodes.OK,
            message: "Day fetched successfully",
            data: day,
        };
        return res.status(StatusCodes.OK).json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Failed to get day",
        };
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
}