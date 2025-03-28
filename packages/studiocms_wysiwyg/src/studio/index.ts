/**
 * These triple-slash directives defines dependencies to various declaration files that will be
 * loaded when a user imports the StudioCMS plugin in their Astro configuration file. These
 * directives must be first at the top of the file and can only be preceded by this comment.
 */
/// <reference types="./virtual.d.ts" preserve="true" />
/// <reference types="studiocms/v/types" />

import { addVirtualImports, createResolver } from 'astro-integration-kit';
import { type StudioCMSPlugin, definePlugin } from 'studiocms/plugins';
import type { SanitizeOptions } from 'ultrahtml/transformers/sanitize';
import { shared } from './shared.js';

/**
 * Represents the configuration options for the StudioCMS WYSIWYG Plugin.
 */
export type StudioCMSWYSIWYGStudioOptions = {
	/** The license key required for the GrapesJS StudioSDK. */
	licenseKey: string;
	/**
	 * YouTube API Key
	 *
	 * You must provide your own apiKey in the plugin options when using this in your project. Get a YouTube Data API v3 key from the [Google Cloud Console](https://console.cloud.google.com/apis/library/browse?q=youtube).
	 */
	youtubeAPIKey?: string;
	/**
	 * Google Data API v3 Key, Get yours at [Google Cloud Console](https://console.cloud.google.com/)
	 */
	googleFontsAPIKey?: string;
	/** Options passed to the HTML Transformer during rendering */
	sanitize?: SanitizeOptions;
};

/**
 * Creates a StudioCMS plugin for integrating the GrapesJS StudioSDK WYSIWYG editor into the StudioCMS environment.
 *
 * > **Important:** GrapesJS StudioSDK License is required. If you would like a WYSIWYG Editor that does not require
 * > a license please try the `@studiocms/wysiwyg` default export instead.
 *
 * @returns A `StudioCMSPlugin` object that defines the plugin configuration, including page types,
 *          integration hooks, and other metadata.
 */
function studiocmsWYSIWYGStudio(options: StudioCMSWYSIWYGStudioOptions): StudioCMSPlugin {
	// Resolve the path to the current file
	const { resolve } = createResolver(import.meta.url);

	// Define the package identifier
	const packageIdentifier = '@studiocms/wysiwyg/studio';

	// Return the plugin configuration
	return definePlugin({
		identifier: packageIdentifier,
		name: 'StudioCMS WYSIWYG (GrapesJS StudioSDK)',
		studiocmsMinimumVersion: '0.1.0-beta.13',
		pageTypes: [
			{
				identifier: 'studiocms/wysiwyg/studio',
				label: 'GrapesJS StudioSDK',
				rendererComponent: resolve('./components/Render.astro'),
				pageContentComponent: resolve('./components/StudioSDKEditor.astro'),
			},
		],
		integration: {
			name: packageIdentifier,
			hooks: {
				'astro:config:setup': (params) => {
					addVirtualImports(params, {
						name: packageIdentifier,
						imports: {
							'studiocms:wysiwyg/studio/client': `
								export const licenseKey = ${JSON.stringify(options.licenseKey)};
								export const youtubeAPIKey = ${JSON.stringify(options.youtubeAPIKey)};
								export const googleFontsAPIKey = ${JSON.stringify(options.googleFontsAPIKey)};
								export * from '${resolve('./utils.js')}';
							`,
						},
					});
				},
				'astro:config:done': () => {
					shared.sanitize = options.sanitize || {};
				},
			},
		},
	});
}

export default studiocmsWYSIWYGStudio;
