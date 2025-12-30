import { clerkMiddleware } from "@clerk/express";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
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

app.use(cors({
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
}));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(clerkMiddleware());
app.use(compression());

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/challenge", challengeRouter);
app.use("/api/v1/mood", moodRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/exercise", exerciseRouter);

// Error handler must be last
app.use(errorHandler);

app.listen(env.PORT, ()=> {
	console.log(`Server is running on http://localhost:${env.PORT}`);
});
