import { Router } from "express";
import {
	getAllWeeks,
	getWeek,
	getDay,
} from "../controllers/challenge.controller";

const challengeRouter = Router();

challengeRouter.get("/", getAllWeeks);
challengeRouter.get("/:weekId", getWeek);
challengeRouter.get("/:weekId/:dayNumber", getDay);

export { challengeRouter };
