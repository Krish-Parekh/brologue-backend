import express from "express";
import { challengeRouter, moodRouter, userRouter } from "./routers";
import { env } from "./utils/env";
import { clerkMiddleware } from "@clerk/express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(clerkMiddleware());

app.use("/api/v1/challenge", challengeRouter);
app.use("/api/v1/mood", moodRouter);
app.use("/api/v1/user", userRouter);

app.listen(env.PORT, () => {
	console.log(`Server is running on the port ${env.PORT}.`);
});
