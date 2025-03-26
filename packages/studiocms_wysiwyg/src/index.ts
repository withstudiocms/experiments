/**
 * These triple-slash directives defines dependencies to various declaration files that will be
 * loaded when a user imports the StudioCMS plugin in their Astro configuration file. These
 * directives must be first at the top of the file and can only be preceded by this comment.
 */
/// <reference types="studiocms/v/types" />

import { addVirtualImports, createResolver } from 'astro-integration-kit';
import { type StudioCMSPlugin, definePlugin } from 'studiocms/plugins';

export function studiocmsWYSIWYG(): StudioCMSPlugin {
	// Resolve the path to the current file
	const { resolve } = createResolver(import.meta.url);

	// Define the package identifier
	const packageIdentifier = '@studiocms/wysiwyg';

	// Return the plugin configuration
	return definePlugin({
		identifier: packageIdentifier,
		name: 'StudioCMS WYSIWYG Editor',
		studiocmsMinimumVersion: '0.1.0-beta.13',
		pageTypes: [
			{
				identifier: 'studiocms/wysiwyg',
				label: 'WYSIWYG',
				rendererComponent: 'studiocms/html',
				pageContentComponent: 'studiocms/html',
			},
		],
		integration: {
			name: packageIdentifier,
			hooks: {
				'astro:config:setup': () => {},
				'astro:config:done': () => {},
			},
		},
	});
}

export default studiocmsWYSIWYG;
