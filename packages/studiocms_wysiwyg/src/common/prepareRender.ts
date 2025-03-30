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
	const contentToRender = data.defaultContent?.content
		? parse<{ __STUDIOCMS_HTML: string }>(data.defaultContent.content).__STUDIOCMS_HTML
		: '<h1>Error: No content found</h1>';

	// Render content
	return transformHTML(contentToRender, components, sanitize);
}
