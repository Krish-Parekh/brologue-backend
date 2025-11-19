import express from "express";
import dotenv from "dotenv";
import challengeRouter from "./router/challenge";
import cors from "cors";

const app = express();

dotenv.config({
    path: ".env",
});

app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());

app.use('/api/challenge', challengeRouter);

app.listen(3000, '0.0.0.0', () => {
    console.log(`Server is running on port ${process.env.PORT!} on http://0.0.0.0:${process.env.PORT!}`);
});