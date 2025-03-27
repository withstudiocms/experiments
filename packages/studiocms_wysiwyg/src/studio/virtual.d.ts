declare module 'virtual:studiocms/plugins/renderers' {
	export const studiocms_wysiwyg_studio: typeof import('./components/Render.astro').default;
}

declare module 'studiocms:wysiwyg/studio/client' {
	export type AstroComponentBlocks = import('./utils').AstroComponentBlocks;
	export type AstroComponentEditorBlocks = import('./utils').AstroComponentEditorBlocks;
	export const fallbackProject: typeof import('./utils').fallbackProject;
	export const licenseKey: string;
	export const AstroSVG: string;
	export const getPlugin: typeof import('./utils').getPlugin;
	export const convertComponentBlocks: typeof import('./utils').convertComponentBlocks;
	export const parse: typeof import('./utils').parse;
	export const firstUpperCase: typeof import('./utils').firstUpperCase;
	export const generateHTML: typeof import('./utils').generateHTML;
	export const getEditorSettings: typeof import('./utils').getEditorSettings;
}
