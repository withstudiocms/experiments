import type { Editor, Plugin } from 'grapesjs';
import loadComponents from './components/index.js';
import loadBlocks from './blocks.js';
import type { TabsOptions } from './types.js';
import defaultOptions from './options.js';

export type PluginOptions = TabsOptions;

const plugin: Plugin<Partial<PluginOptions>> = (editor, opts = {}) => {
	const options = {
		...defaultOptions,
		...opts,
	};

	// Add components
	loadComponents(editor, options);

	// Add blocks
	loadBlocks(editor, options);
};

export default plugin;
