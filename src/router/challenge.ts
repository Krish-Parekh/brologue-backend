import { Router } from "express";
import { getAllWeeks, getWeek, getDay } from "../controller/challenge";
const challengeRouter = Router();

challengeRouter.get('/', getAllWeeks);
challengeRouter.get('/:weekId', getWeek);
challengeRouter.get('/:weekId/:dayNumber', getDay);

export default challengeRouter;