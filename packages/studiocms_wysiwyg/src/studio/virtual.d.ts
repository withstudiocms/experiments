declare module 'virtual:studiocms/plugins/renderers' {
	export const studiocms_wysiwyg_studio: typeof import('./components/Render.astro').default;
}

declare module 'studiocms:wysiwyg/studio/client' {
	/**
	 * Represents an array of Astro component blocks, where each block contains metadata
	 * about a specific component used in the system.
	 */
	export type AstroComponentBlocks = import('./utils').AstroComponentBlocks;
	/**
	 * Represents an array of editor blocks used in the Astro component editor.
	 * Each block contains metadata and a function to generate its content.
	 */
	export type AstroComponentEditorBlocks = import('./utils').AstroComponentEditorBlocks;
	/**
	 * Converts the first character of a given string to uppercase while keeping the rest of the string unchanged.
	 *
	 * @param text - The input string to be transformed.
	 * @returns A new string with the first character converted to uppercase. If the input string has a length of 1 or less, it is returned unchanged.
	 */
	export const firstUpperCase: typeof import('./utils').firstUpperCase;
	/**
	 * Parses a JSON string into a strongly-typed object.
	 *
	 * @template T - The type of the object to parse the JSON string into.
	 * @param data - The JSON string to be parsed.
	 * @returns The parsed object of type `T`.
	 * @throws {SyntaxError} If the input string is not valid JSON.
	 */
	export const parse: typeof import('./utils').parse;
	/**
	 * A fallback project object used as a default value when a project fails to load.
	 *
	 * @constant
	 * @property {Object} default - The default project structure.
	 * @property {Array<Object>} default.pages - An array of page objects for the fallback project.
	 * @property {string} default.pages[].component - The HTML content to display as a fallback message.
	 */
	export const fallbackProject: typeof import('./utils').fallbackProject;
	/** License Key for GrapesJS StudioSDK */
	export const licenseKey: string;
	/**
	 * YouTube API Key
	 *
	 * You must provide your own apiKey in the plugin options when using this in your project. Get a YouTube Data API v3 key from the [Google Cloud Console](https://console.cloud.google.com/apis/library/browse?q=youtube).
	 */
	export const youtubeAPIKey: string | undefined;
	/** Astro Logo SVG */
	export const AstroSVG: string;
	/**
	 * Converts an array of `AstroComponentBlocks` into an array of `AstroComponentEditorBlocks`.
	 *
	 * Each block in the input array is transformed by extracting its `key` property
	 * and using it to generate a `content` function that returns a string representation
	 * of an HTML element with the given key as its tag name. The rest of the block's properties
	 * are preserved in the output.
	 *
	 * @param blocks - An array of `AstroComponentBlocks` to be converted.
	 * @returns An array of `AstroComponentEditorBlocks` with updated `content` functions.
	 */
	export const convertComponentBlocks: typeof import('./utils').convertComponentBlocks;
	/**
	 * Generates the HTML content of the first page from the editor's project files.
	 *
	 * @param editor - The editor instance implementing the `WithEditorProps['editor']` interface.
	 * @returns A promise that resolves to a string containing the HTML content of the first page.
	 *
	 * @remarks
	 * - This function uses the `studio:projectFiles` command to retrieve the project files
	 *   with inline styles.
	 * - It assumes that the first page is identified by the MIME type `text/html`.
	 * - The `content` property of the first page is cast to a string and returned as the result.
	 *
	 * @throws Will throw an error if the `studio:projectFiles` command fails or if no HTML file is found.
	 */
	export const generateHTML: typeof import('./utils').generateHTML;
	/**
	 * Creates a plugin for the editor to handle custom Astro components.
	 *
	 * @param componentKeys - An array of strings representing the tag names of the Astro components to be recognized.
	 * @returns A function that takes an editor instance and registers a custom component type (`astro-component`) with the editor.
	 *
	 * The custom component type includes:
	 * - A `isComponent` method to determine if an element matches one of the specified `componentKeys`.
	 * - A `view` object that defines how the component is rendered in the editor, including:
	 *   - A placeholder HTML structure with a styled card layout.
	 *   - A loading animation for the placeholder.
	 *
	 * The placeholder displays the name of the Astro component in a styled card format.
	 */
	export const getPlugin: typeof import('./utils').getPlugin;
	/**
	 * Generates the editor settings for the GrapesJS StudioSDK WYSIWYG editor.
	 *
	 * @param licenseKey - The license key required to initialize the editor.
	 * @param root - The root HTML element containing dataset attributes for blocks and component keys.
	 * @param pageContent - The HTML element containing the serialized project data as inner text.
	 * @returns An object of type `CreateEditorOptions` containing the configuration for the editor.
	 *
	 * The returned configuration includes:
	 * - License key validation.
	 * - Plugins setup based on component keys.
	 * - Project and block data initialization.
	 * - Asset storage configuration.
	 * - Custom storage handlers for saving and loading project data.
	 * - Autosave settings for periodic saving of changes.
	 */
	export const getEditorSettings: typeof import('./utils').getEditorSettings;
}
