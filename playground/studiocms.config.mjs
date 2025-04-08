import blog from '@studiocms/blog';
import socialPoster from '@studiocms/socialposter';
import WYSIWYG from '@studiocms/wysiwyg';
import WYSIWYGStudio from '@studiocms/wysiwyg/studio';
import { defineStudioCMSConfig } from 'studiocms/config';

export default defineStudioCMSConfig({
	dbStartPage: false,
	verbose: true,
	plugins: [
		blog(),
		WYSIWYGStudio({ licenseKey: 'LICENSE' }),
		WYSIWYG(),
		socialPoster({ bluesky: true, threads: true, twitter: true }),
	],
	dashboardConfig: {
		developerConfig: {
			demoMode: false,
		},
	},
	componentRegistry: {
		test: './src/components/test.astro',
	},
});
