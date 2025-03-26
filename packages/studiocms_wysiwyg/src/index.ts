/**
 * These triple-slash directives defines dependencies to various declaration files that will be
 * loaded when a user imports the StudioCMS plugin in their Astro configuration file. These
 * directives must be first at the top of the file and can only be preceded by this comment.
 */
/// <reference types="studiocms/v/types" />

import { addVirtualImports, createResolver } from 'astro-integration-kit';
import { type StudioCMSPlugin, definePlugin } from 'studiocms/plugins';

export function plugin(): StudioCMSPlugin {
	// Resolve the path to the current file
	const { resolve } = createResolver(import.meta.url);

	// Define the package identifier
	const packageIdentifier = '@studiocms/mdx';

	// Return the plugin configuration
	return definePlugin({
		identifier: packageIdentifier,
		name: 'StudioCMS plugin',
		studiocmsMinimumVersion: '0.1.0-beta.13',
		pageTypes: [],
		integration: {
			name: packageIdentifier,
			hooks: {
				'astro:config:setup': (params) => {},
				'astro:config:done': () => {},
			},
		},
	});
}

export default plugin;
