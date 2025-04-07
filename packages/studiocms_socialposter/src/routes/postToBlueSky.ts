import type { APIContext, APIRoute } from "astro";
import { AtpAgent } from "@atproto/api";
import {
	BLUESKY_PASSWORD,
	BLUESKY_SERVICE,
	BLUESKY_USERNAME,
} from "astro:env/server";
import logger from "studiocms:logger";
import { response } from "../utils/response.js";

export const POST: APIRoute = async (context: APIContext) => {
	if (!BLUESKY_PASSWORD || !BLUESKY_SERVICE || !BLUESKY_USERNAME) {
		return response(500, JSON.stringify({ error: "Missing ENV Variables" }));
	}

	const { content } = await context.request.json();

	if (!content) {
		return response(
			500,
			JSON.stringify({ error: "Content must not be empty" }),
		);
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

		return response(
			200,
			JSON.stringify({ message: "Successfully sent BlueSky message" }),
		);
	} catch (e) {
		logger.error(`Error posting to Bluesky: ${e}`);

		return response(
			500,
			JSON.stringify({
				error: (e as Error).message || "Failed to post to BlueSky",
			}),
		);
	}
};
