import type { APIContext, APIRoute } from 'astro';

export const POST: APIRoute = (context: APIContext) => {
	return new Response(null, {
		status: 405,
		statusText: 'Method Not Allowed',
		headers: {
			'ACCESS-CONTROL-ALLOW-ORIGIN': '*',
		},
	});
};
