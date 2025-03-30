import type { PluginPageTypeRendererProps } from 'studiocms/types';
import { importComponentsKeys } from 'studiocms/lib/renderer/runtime.js';
import { createComponentProxy, transformHTML } from '../runtime/AstroComponentProxy.js';
import type { SanitizeOptions } from 'ultrahtml/transformers/sanitize';
import { parse } from '../utils.js';
import type { SSRResult } from 'astro';

export async function prepareRender(
	result: SSRResult,
	data: PluginPageTypeRendererProps['data'],
	sanitize?: SanitizeOptions | undefined
) {
	// Import components
	const _components = await importComponentsKeys();

	// Create component proxy
	const components = createComponentProxy(result, _components);

	// Get content to render
	let contentToRender = '<h1>Error: No content found</h1>';
	try {
		if (data.defaultContent?.content) {
			const parsed = parse<{ __STUDIOCMS_HTML: string }>(data.defaultContent.content);
			if (parsed?.__STUDIOCMS_HTML) {
				contentToRender = parsed.__STUDIOCMS_HTML;
			} else {
				contentToRender = '<h1>Error: Content found but invalid format</h1>';
			}
		}
	} catch (error) {
		contentToRender = `<h1>Error parsing content: ${error instanceof Error ? error.message : 'Unknown error'}</h1>`;
	}

	// Render content
	return transformHTML(contentToRender, components, sanitize);
}
