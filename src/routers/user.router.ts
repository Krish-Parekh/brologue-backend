import { Router } from "express";
import { updateUserName } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { updateUserNameRequestSchema } from "../types/user.types";
import { asyncHandler } from "../utils/asyncHandler";

const userRouter = Router();

// All user routes require authentication
userRouter.use(requireAuth);

// Update user's first name and/or last name
userRouter.patch(
	"/",
	validateBody(updateUserNameRequestSchema),
	asyncHandler(updateUserName),
);

export { userRouter };
