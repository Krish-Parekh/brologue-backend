import express from "express";
import { challengeRouter } from "./routers";
import { env } from "./utils/env";
import { clerkMiddleware } from '@clerk/express'

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/v1/challenge", challengeRouter);

app.listen(env.PORT, '0.0.0.0', () => {
	console.log(`Server is running on the port ${env.PORT}.`);
});
