import blog from '@studiocms/blog';
import { defineStudioCMSConfig } from 'studiocms/config';

export default defineStudioCMSConfig({
	dbStartPage: false,
	verbose: true,
	plugins: [blog()],
	dashboardConfig: {
		developerConfig: {
			demoMode: false,
		},
	},
	componentRegistry: {
		test: './src/components/test.astro',
	},
});
