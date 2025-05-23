/**
 * These triple-slash directives defines dependencies to various declaration files that will be
 * loaded when a user imports the StudioCMS plugin in their Astro configuration file. These
 * directives must be first at the top of the file and can only be preceded by this comment.
 */
/// <reference types="./virtual.d.ts" preserve="true" />
/// <reference types="studiocms/v/types" />

import { createResolver } from 'astro-integration-kit';
import { type StudioCMSPlugin, definePlugin } from 'studiocms/plugins';
import type { SanitizeOptions } from 'ultrahtml/transformers/sanitize';
import { shared } from './shared.js';

/**
 * Represents the configuration options for the StudioCMS WYSIWYG Plugin.
 */
export type StudioCMSWYSIWYGOptions = {
	/** Options passed to the HTML Transformer during rendering */
	sanitize?: SanitizeOptions;
};

/**
 * StudioCMS WYSIWYG Editor
 */
function studiocmsWYSIWYG(options?: StudioCMSWYSIWYGOptions): StudioCMSPlugin {
	// Resolve the path to the current file
	const { resolve } = createResolver(import.meta.url);

	// Define the package identifier
	const packageIdentifier = '@studiocms/wysiwyg';

	// Return the plugin configuration
	return definePlugin({
		identifier: packageIdentifier,
		name: 'StudioCMS WYSIWYG Editor',
		studiocmsMinimumVersion: '0.1.0-beta.18',
		hooks: {
			'studiocms:astro:config': ({ addIntegrations }) => {
				addIntegrations({
					name: packageIdentifier,
					hooks: {
						'astro:config:setup': (params) => {
							params.injectRoute({
								entrypoint: resolve('./routes/partial.astro'),
								pattern: '/studiocms_api/wysiwyg_editor/partial',
								prerender: false,
							});
						},
						'astro:config:done': () => {
							shared.sanitize = options?.sanitize || {};
						},
					},
				});
			},
			'studiocms:config:setup': ({ setRendering }) => {
				setRendering({
					pageTypes: [
						{
							identifier: 'studiocms/wysiwyg',
							label: 'WYSIWYG',
							rendererComponent: resolve('./components/Render.astro'),
							pageContentComponent: resolve('./components/Editor.astro'),
						},
					],
				});
			},
		},
	});
}

export default studiocmsWYSIWYG;
