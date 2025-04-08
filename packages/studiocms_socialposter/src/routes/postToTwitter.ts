import {
	TWITTER_ACCESS_SECRET,
	TWITTER_ACCESS_TOKEN,
	TWITTER_API_KEY,
	TWITTER_API_SECRET,
} from 'astro:env/server';
import logger from 'studiocms:logger';
import { response } from '../utils/response.js';
import type { APIContext, APIRoute } from 'astro';
import { TwitterApi } from 'twitter-api-v2';
import { getUserData, verifyUserPermissionLevel } from 'studiocms:auth/lib/user';

export const POST: APIRoute = async (context: APIContext) => {
	const userSessionData = await getUserData(context);

	const isEditor = await verifyUserPermissionLevel(userSessionData, 'editor');

	if (!isEditor) {
		return response(403, JSON.stringify({ error: 'Forbidden' }));
	}

	if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
		return response(500, JSON.stringify({ error: 'Missing ENV Variables' }));
	}

	// Initialize the Twitter client with credentials from environment variables
	const client = new TwitterApi({
		appKey: TWITTER_API_KEY,
		appSecret: TWITTER_API_SECRET,
		accessToken: TWITTER_ACCESS_TOKEN,
		accessSecret: TWITTER_ACCESS_SECRET,
	});

	const { content } = await context.request.json();

	if (!content) {
		return response(400, JSON.stringify({ error: 'Content must not be empty' }));
	}

	try {
		// Create the tweet
		await client.v2.tweet(content);

		return response(200, JSON.stringify({ message: 'Successfully sent Twitter/X message' }));
	} catch (e) {
		logger.error(`Error posting to Twitter / X: ${e}`);

		return response(
			500,
			JSON.stringify({
				error: (e as Error).message || 'Failed to post to Twitter / X',
			})
		);
	}
};
