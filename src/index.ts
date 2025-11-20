import express from "express";
import { challengeRouter } from "./routers";
import { env } from "./utils/env";
import { clerkClient, clerkMiddleware, getAuth, requireAuth } from '@clerk/express'

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.get('/protected', requireAuth(), async (req, res) => {
	console.log('protected route hit');
	const { userId } = getAuth(req)
	if (!userId) {
		return res.status(401).json({ error: 'Unauthorized' })
	}
	const user = await clerkClient.users.getUser(userId)

	return res.json({ user })
})

app.use("/api/v1/challenge", challengeRouter);

app.listen(env.PORT, '0.0.0.0', () => {
	console.log(`Server is running on the port ${env.PORT}.`);
});
