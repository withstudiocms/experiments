import blog from '@studiocms/blog';
import { defineStudioCMSConfig } from 'studiocms/config';
import WYSIWYGStudio from '@studiocms/wysiwyg/studio';
import WYSIWYG from '@studiocms/wysiwyg';

export default defineStudioCMSConfig({
	dbStartPage: false,
	verbose: true,
	plugins: [blog(), WYSIWYGStudio({ licenseKey: 'LICENSE' }), WYSIWYG()],
	dashboardConfig: {
		developerConfig: {
			demoMode: false,
		},
	},
	componentRegistry: {
		test: './src/components/test.astro',
	},
});
