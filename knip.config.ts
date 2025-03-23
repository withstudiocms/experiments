import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	exclude: ['duplicates', 'optionalPeerDependencies'],
	workspaces: {
		'.': {
			ignoreDependencies: ['@changesets/config'],
			entry: ['.github/workflows/*.yml', 'scripts/*.{cjs,ts}'],
			project: ['.github/workflows/*.yml', 'scripts/*.{cjs,ts}'],
		},
		'build-scripts': {
			entry: '{index,cli}.js',
			project: '**/*.js',
		},
		'packages/*': {
			entry: ['src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			project: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
			astro: {
				entry: ['src/**/*.astro'],
				project: ['src/**/*.astro'],
			},
		},
	},
};

export default config;
