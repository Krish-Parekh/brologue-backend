import { Router } from "express";
import {
	createDailyProgress,
	getAllWeeks,
	getDay,
	getWeek,
} from "../controllers/challenge.controller";
import { requireAuth } from "../middleware/auth.middleware";

const challengeRouter = Router();

// All challenge routes require authentication
challengeRouter.use(requireAuth);

challengeRouter.get("/", getAllWeeks);
challengeRouter.get("/:weekId", getWeek);
challengeRouter.get("/:weekId/:dayNumber", getDay);
challengeRouter.post("/:weekId/:dayNumber", createDailyProgress);

export { challengeRouter };
