import { Router } from "express";
import {
	getAllWeeks,
	getWeek,
	getDay,
	createDailyProgress,
} from "../controllers/challenge.controller";

const challengeRouter = Router();

challengeRouter.get("/", getAllWeeks);
challengeRouter.get("/:weekId", getWeek);
challengeRouter.get("/:weekId/:dayNumber", getDay);

challengeRouter.post("/:weekId/:dayNumber", createDailyProgress);

export { challengeRouter };
