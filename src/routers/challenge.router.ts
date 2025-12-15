import { Router } from "express";
import {
	createDailyProgress,
	getAllWeeks,
	getDay,
	getWeek,
} from "../controllers/challenge.controller";
import { requireAuth } from "../middleware/auth.middleware";
import {
	validateBody,
	validateParams,
} from "../middleware/validate.middleware";
import {
	dailyProgressBodySchema,
	dailyProgressParamSchema,
	dayRequestSchema,
	weekRequestSchema,
} from "../types/challenge.types";
import { asyncHandler } from "../utils/asyncHandler";

const challengeRouter = Router();

// All challenge routes require authentication
challengeRouter.use(requireAuth);

challengeRouter.get("/", asyncHandler(getAllWeeks));
challengeRouter.get(
	"/:weekId",
	validateParams(weekRequestSchema),
	asyncHandler(getWeek),
);
challengeRouter.get(
	"/:weekId/:dayNumber",
	validateParams(dayRequestSchema),
	asyncHandler(getDay),
);
challengeRouter.post(
	"/:weekId/:dayNumber",
	validateParams(dailyProgressParamSchema),
	validateBody(dailyProgressBodySchema),
	asyncHandler(createDailyProgress),
);

export { challengeRouter };
