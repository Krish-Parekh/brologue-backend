import express from "express";
import dotenv from "dotenv";
import challengeRouter from "./router/challenge";
import cors from "cors";

const app = express();

dotenv.config({
    path: ".env",
});

app.use(cors());
app.use(express.json());

app.use('/api/challenge', challengeRouter);

app.listen(process.env.PORT!, () => {
    console.log(`Server is running on port ${process.env.PORT!}`);
});