import { Router } from "express";
import { updateUserName } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const userRouter = Router();

// All user routes require authentication
userRouter.use(requireAuth);

// Update user's first name and/or last name
userRouter.patch("/", updateUserName);

export { userRouter };
