/**
 * These triple-slash directives defines dependencies to various declaration files that will be
 * loaded when a user imports the StudioCMS plugin in their Astro configuration file. These
 * directives must be first at the top of the file and can only be preceded by this comment.
 */
/// <reference types="./virtuals.d.ts" preserve="true" />
/// <reference types="../astroenv.d.ts" />
/// <reference types="../ui.d.ts" />
/// <reference types="studiocms/v/types" />
import { addVirtualImports, createResolver } from 'astro-integration-kit';
import { envField } from 'astro/config';
import { type StudioCMSPlugin, definePlugin } from 'studiocms/plugins';
import { addAstroEnvConfig } from './utils/astroEnvConfig.js';

export interface StudioCMSSocialPosterOptions {
	bluesky: boolean;
	threads: boolean;
	twitter: boolean;
}

const defaultOptions: StudioCMSSocialPosterOptions = {
	bluesky: false,
	threads: false,
	twitter: false,
};

function studiocmsSocialPoster(opts?: Partial<StudioCMSSocialPosterOptions>): StudioCMSPlugin {
	// Resolve the path to the current file
	const { resolve } = createResolver(import.meta.url);

	// Define the package identifier
	const packageIdentifier = '@studiocms/socialposter';

	const options: StudioCMSSocialPosterOptions = {
		...defaultOptions,
		...opts,
	};

	return definePlugin({
		identifier: packageIdentifier,
		name: 'StudioCMS Social Poster',
		studiocmsMinimumVersion: '0.1.0-beta.15',
		dashboardPages: {
			user: [
				{
					title: {
						en: 'Share to Social Media',
						de: 'Share to Social Media',
						es: 'Share to Social Media',
						fr: 'Share to Social Media',
					},
					description: 'Share content on Social media',
					sidebar: 'single',
					pageBodyComponent: resolve('./pages/socials.astro'),
					route: 'share',
					requiredPermissions: 'editor',
					icon: 'share',
				},
			],
		},
		integration: {
			name: packageIdentifier,
			hooks: {
				'astro:config:setup': (params) => {
					const { injectRoute } = params;

					addAstroEnvConfig(params, {
						validateSecrets: true,
						schema: {
							BLUESKY_SERVICE: envField.string({
								context: 'server',
								access: 'secret',
								optional: !options.bluesky,
							}),
							BLUESKY_USERNAME: envField.string({
								context: 'server',
								access: 'secret',
								optional: !options.bluesky,
							}),
							BLUESKY_PASSWORD: envField.string({
								context: 'server',
								access: 'secret',
								optional: !options.bluesky,
							}),
							THREADS_USER_ID: envField.string({
								context: 'server',
								access: 'secret',
								optional: !options.threads,
							}),
							THREADS_ACCESS_TOKEN: envField.string({
								context: 'server',
								access: 'secret',
								optional: !options.threads,
							}),
							TWITTER_API_KEY: envField.string({
								context: 'server',
								access: 'secret',
								optional: !options.twitter,
							}),
							TWITTER_API_SECRET: envField.string({
								context: 'server',
								access: 'secret',
								optional: !options.twitter,
							}),
							TWITTER_ACCESS_TOKEN: envField.string({
								context: 'server',
								access: 'secret',
								optional: !options.twitter,
							}),
							TWITTER_ACCESS_SECRET: envField.string({
								context: 'server',
								access: 'secret',
								optional: !options.twitter,
							}),
						},
					});

					addVirtualImports(params, {
						name: packageIdentifier,
						imports: {
							'studiocms:socialposter/config': `export default ${JSON.stringify(options)}`,
						},
					});

					if (options.bluesky) {
						injectRoute({
							pattern: '/studiocms_api/socialposter/post-to-bluesky',
							entrypoint: resolve('./routes/postToBlueSky.js'),
							prerender: false,
						});
					}

					if (options.threads) {
						injectRoute({
							pattern: '/studiocms_api/socialposter/post-to-threads',
							entrypoint: resolve('./routes/postToThreads.js'),
							prerender: false,
						});
					}

					if (options.twitter) {
						injectRoute({
							pattern: '/studiocms_api/socialposter/post-to-twitter',
							entrypoint: resolve('./routes/postToTwitter.js'),
							prerender: false,
						});
					}
				},
			},
		},
	});
}

export default studiocmsSocialPoster;
