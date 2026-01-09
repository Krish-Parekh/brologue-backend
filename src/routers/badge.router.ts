import { Router } from "express";
import { getUserBadges } from "../controllers/badge.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const badgeRouter = Router();

// All badge routes require authentication
badgeRouter.use(requireAuth);

// Get user's badges with progress
badgeRouter.get("/", asyncHandler(getUserBadges));

export { badgeRouter };
