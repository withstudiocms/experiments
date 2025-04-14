import type { SSRResult } from 'astro';
import { importComponentsKeys } from 'studiocms/lib/renderer/runtime.js';
import { createComponentProxy, transformHTML } from 'studiocms/runtime';
import type { PluginPageTypeRendererProps } from 'studiocms/types';
import type { SanitizeOptions } from 'ultrahtml/transformers/sanitize';
import { parse } from '../utils.js';

/**
 * Prepares HTML content for rendering in the WYSIWYG editor.
 * @param result - The Astro SSR result object
 * @param data - The page data containing content to render
 * @param sanitize - Optional sanitization options for HTML content
 * @returns Transformed HTML ready for rendering
 */
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

	// Returns the transformed HTML with components rendered
	return transformHTML(contentToRender, components, sanitize);
}
