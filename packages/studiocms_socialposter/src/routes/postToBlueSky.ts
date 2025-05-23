import { BLUESKY_PASSWORD, BLUESKY_SERVICE, BLUESKY_USERNAME } from 'astro:env/server';
import { getUserData, verifyUserPermissionLevel } from 'studiocms:auth/lib/user';
import logger from 'studiocms:logger';
import { AtpAgent } from '@atproto/api';
import type { APIContext, APIRoute } from 'astro';
import { response } from '../utils/response.js';

export const POST: APIRoute = async (context: APIContext) => {
	const userSessionData = await getUserData(context);

	const isEditor = await verifyUserPermissionLevel(userSessionData, 'editor');

	if (!isEditor) {
		return response(403, JSON.stringify({ error: 'Forbidden' }));
	}

	if (!BLUESKY_PASSWORD || !BLUESKY_SERVICE || !BLUESKY_USERNAME) {
		return response(500, JSON.stringify({ error: 'Missing ENV Variables' }));
	}

	const { content } = await context.request.json();

	if (!content) {
		return response(400, JSON.stringify({ error: 'Content must not be empty' }));
	}

	if (content.length > 300) {
		return response(400, JSON.stringify({ error: 'Content exceeds the 300-character limit' }));
	}

	const agent = new AtpAgent({
		service: new URL(BLUESKY_SERVICE),
	});

	try {
		await agent.login({
			identifier: BLUESKY_USERNAME,
			password: BLUESKY_PASSWORD,
		});

		await agent.post({
			text: content,
			createdAt: new Date().toISOString(),
		});

		return response(200, JSON.stringify({ message: 'Successfully sent BlueSky message' }));
	} catch (e) {
		logger.error(`Error posting to Bluesky: ${e}`);

		return response(
			500,
			JSON.stringify({
				error: (e as Error).message || 'Failed to post to BlueSky',
			})
		);
	}
};
