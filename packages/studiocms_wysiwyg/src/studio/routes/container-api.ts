import type { APIContext, APIRoute } from 'astro';
import { experimental_AstroContainer } from 'astro/container';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { importComponentsKeys } from 'studiocms/lib/renderer/runtime.js';

// Import components
const components = await importComponentsKeys();

export const POST: APIRoute = async (context: APIContext) => {
	const { componentKey }: { componentKey: string } = await context.request.json();

	const container = await experimental_AstroContainer.create();

	const response = await container.renderToString(
		components[componentKey] as AstroComponentFactory
	);

	return new Response(null, {
		status: 405,
		statusText: 'Method Not Allowed',
		headers: {
			'ACCESS-CONTROL-ALLOW-ORIGIN': '*',
		},
	});
};
