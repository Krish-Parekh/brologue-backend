import express from "express";
import dotenv from "dotenv";
import { challengeRouter } from "./routers";

const app = express();

dotenv.config({
	path: ".env",
});

import { env } from "./utils/env";

app.use(express.json());
app.use("/api/challenge", challengeRouter);

app.listen(env.PORT, () => {
	console.log(`Server is running on the port ${env.PORT}.`);
});
