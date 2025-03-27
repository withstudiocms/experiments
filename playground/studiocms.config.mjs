import blog from '@studiocms/blog';
import { defineStudioCMSConfig } from 'studiocms/config';
import WYSIWYGStudio from '@studiocms/wysiwyg/studio';

export default defineStudioCMSConfig({
	dbStartPage: false,
	verbose: true,
	plugins: [blog(), WYSIWYGStudio({ licenseKey: 'LICENSE' })],
	dashboardConfig: {
		developerConfig: {
			demoMode: false,
		},
	},
	componentRegistry: {
		test: './src/components/test.astro',
	},
});
