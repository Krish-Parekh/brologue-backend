import { clerkMiddleware } from "@clerk/express";
import bodyParser from "body-parser";
import express from "express";
import { errorHandler } from "./middleware/error.middleware";
import {
	challengeRouter,
	exerciseRouter,
	healthRouter,
	moodRouter,
	userRouter,
} from "./routers";
import { env } from "./utils/env";

const app = express();

app.use(bodyParser.json());
app.use(clerkMiddleware());

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/challenge", challengeRouter);
app.use("/api/v1/mood", moodRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/exercise", exerciseRouter);

// Error handler must be last
app.use(errorHandler);

app.listen(env.PORT, () => {
	console.log(`Server is running on the port ${env.PORT}.`);
});
