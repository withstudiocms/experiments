import { THREADS_ACCESS_TOKEN, THREADS_USER_ID } from 'astro:env/server';
import { response } from '../utils/response.js';
import type { APIContext, APIRoute } from 'astro';
import logger from 'studiocms:logger';
import { getUserData, verifyUserPermissionLevel } from 'studiocms:auth/lib/user';

export const POST: APIRoute = async (context: APIContext) => {
	const userSessionData = await getUserData(context);

	const isEditor = await verifyUserPermissionLevel(userSessionData, 'editor');

	if (!isEditor) {
		return response(403, JSON.stringify({ error: 'Forbidden' }));
	}

	if (!THREADS_ACCESS_TOKEN || !THREADS_USER_ID) {
		return response(500, JSON.stringify({ error: 'Missing ENV Variables' }));
	}

	const { content } = await context.request.json();

	if (!content) {
		return response(400, JSON.stringify({ error: 'Content must not be empty' }));
	}

	if (content.length > 500) {
		return response(400, JSON.stringify({ error: 'Content exceeds the 300-character limit' }));
	}

	try {
		console.log('Creating Threads post container...');

		const createResponseParams = new URLSearchParams({
			text: content,
			access_token: THREADS_ACCESS_TOKEN,
			media_type: 'TEXT',
		});

		const createResponse = await fetch(
			`https://graph.threads.net/v1.0/${THREADS_USER_ID}/threads?${createResponseParams.toString()}`,
			{
				method: 'POST',
			}
		);

		const createResponseData = await createResponse.json();

		console.log('Create response:', createResponseData);

		if (!createResponseData.id) {
			throw new Error('Failed to get post container ID');
		}

		console.log('Publishing Threads post...');

		const params = new URLSearchParams({
			creation_id: createResponseData.id,
			access_token: THREADS_ACCESS_TOKEN,
		});

		const publishResponse = await fetch(
			`https://graph.threads.net/v1.0/${THREADS_USER_ID}/threads_publish?${params.toString()}`,
			{
				method: 'POST',
			}
		);

		const publishResponseData = await publishResponse.json();

		console.log('Publish response:', publishResponseData);

		return response(200, JSON.stringify('Successfully sent Threads message'));
	} catch (e) {
		logger.error(`Threads API Error: ${e}`);

		// Type the error appropriately
		type ApiError = Error & {
			response?: {
				data?: {
					error?: { message?: string };
					message?: string;
				};
				status?: number;
			};
			config?: {
				url?: string;
				params?: Record<string, string>;
			};
		};

		const err = e as ApiError;
		const errorMessage =
			err.response?.data?.error?.message ||
			err.response?.data?.message ||
			err.message ||
			'Failed to post to Threads';

		return response(
			500,
			JSON.stringify({
				error: errorMessage,
			})
		);
	}
};
