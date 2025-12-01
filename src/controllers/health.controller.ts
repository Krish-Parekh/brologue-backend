import type { Request, Response } from "express";

export const getHealth = (request: Request, response: Response) => {
	return response.status(200).json({ message: "OK" });
};