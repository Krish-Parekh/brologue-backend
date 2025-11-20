import express from "express";
import { challengeRouter } from "./routers";
import { env } from "./utils/env";

const app = express();

app.use(express.json());
app.use("/api/v1/challenge", challengeRouter);

app.listen(env.PORT, () => {
	console.log(`Server is running on the port ${env.PORT}.`);
});
