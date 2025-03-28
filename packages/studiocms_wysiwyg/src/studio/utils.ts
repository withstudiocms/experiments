import type { CreateEditorOptions, WithEditorProps } from '@grapesjs/studio-sdk';
import { firstUpperCase, parse } from '../utils.js';

export { firstUpperCase, parse };

export const AstroSVG: string =
	'<svg xmlns="http://www.w3.org/2000/svg" style="width:48px;height:48px" viewBox="0 0 24 24"><path fill="currentColor" d="M9.24 19.035c-.901-.826-1.164-2.561-.789-3.819c.65.793 1.552 1.044 2.486 1.186c1.44.218 2.856.137 4.195-.524c.153-.076.295-.177.462-.278c.126.365.159.734.115 1.11c-.107.915-.56 1.622-1.283 2.158c-.289.215-.594.406-.892.608c-.916.622-1.164 1.35-.82 2.41l.034.114a2.4 2.4 0 0 1-1.07-.918a2.6 2.6 0 0 1-.412-1.401c-.003-.248-.003-.497-.036-.74c-.081-.595-.36-.86-.883-.876a1.034 1.034 0 0 0-1.075.843q-.013.058-.033.126M4.1 15.007s2.666-1.303 5.34-1.303l2.016-6.26c.075-.304.296-.51.544-.51c.25 0 .47.206.545.51l2.016 6.26c3.167 0 5.34 1.303 5.34 1.303L15.363 2.602c-.13-.366-.35-.602-.645-.602H9.283c-.296 0-.506.236-.645.602c-.01.024-4.538 12.405-4.538 12.405"/></svg>';

export const fallbackPages = {
	pages: [{ name: 'page' }],
};

/**
 * A fallback project object used as a default value when a project fails to load.
 *
 * @constant
 * @property {Object} default - The default project structure.
 * @property {Array<Object>} default.pages - An array of page objects for the fallback project.
 * @property {string} default.pages[].component - The HTML content to display as a fallback message.
 */
export const fallbackProject = {
	default: fallbackPages,
};

/**
 * Represents an array of Astro component blocks, where each block contains metadata
 * about a specific component used in the system.
 */
export type AstroComponentBlocks = {
	id: string;
	label: string;
	category: string;
	media: string;
	key: string;
}[];

/**
 * Represents an array of editor blocks used in the Astro component editor.
 * Each block contains metadata and a function to generate its content.
 */
export type AstroComponentEditorBlocks = {
	id: string;
	label: string;
	category: string;
	media: string;
	content: () => string;
}[];

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
export function convertComponentBlocks(blocks: AstroComponentBlocks): AstroComponentEditorBlocks {
	return blocks.map(({ key, ...block }) => ({
		...block,
		content: () => `<${key}></${key}>`,
	}));
}

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
export const generateHTML = async (editor: WithEditorProps['editor']): Promise<string> => {
	const page = editor.Pages.getMain();
	const component = page.getMainComponent();
	const htmlData = component.toHTML({ tag: 'div' });
	const styles = editor.getCss({ component })?.replaceAll('body', 'div');
	const html = `${htmlData}${styles ? `<style>${styles}</style>` : ''}`;
	return html;
};

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
export const getPlugin = (componentKeys: string[]) => (editor: WithEditorProps['editor']) => {
	editor.DomComponents.addType('astro-component', {
		isComponent: (el) => componentKeys.includes(el.tagName?.toLowerCase()),
		view: {
			tagName: () => 'div',
			onRender: ({ el, model }) =>
				// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
				(el.innerHTML = `
<div class="container">
    <section class="card">
        <div class="card-detail">
            <div class="card-description loading">Astro Component Placeholder for "${firstUpperCase(model.tagName)}"</div>
        </div>
    </section>
</div>
<style>
.container {
max-width: 100%;
}

.card {
overflow: hidden;
background: white;
border-radius: .25rem;
max-width: 100%;
width: 380px;
box-shadow: 
0 15px 30px 0 rgba(0,0,0,0.05),
0 5px 15px 0 rgba(0,0,0,.05);
transition: ease box-shadow 0.3s;
&:hover {
box-shadow: 
0 15px 60px 0 rgba(0,0,0,0.08),
0 5px 25px 0 rgba(0,0,0,.08);
}
}

.card-detail {
padding: .5rem 1rem;

h3 { 
font-size: 1.5rem; 
margin-bottom: none; 
line-height: .09;
}

p {
line-height: 1.3rem;
}
}

.card-description {
height: 80px;
margin: 0 auto;
width: 100%;
display: flex;
align-items: center;
align-content: center;
justify-content: center;
}

.loading {
position: relative;
background-color: #E2E2E2;

&.card-image {
border-radius: 0;
}

&::after {
display: block;
content: '';
position: absolute;
width: 100%;
height: 100%;
transform: translateX(-100%);
background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .2), transparent);
animation: loading 1.5s infinite;
}
}

@keyframes loading {
100% {
transform: translateX(100%);
}
}
</style>
`),
		},
	});
};

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
export function getEditorSettings(
	licenseKey: string,
	root: HTMLElement,
	pageContent: HTMLElement,
	plugins?: CreateEditorOptions['plugins']
): CreateEditorOptions {
	const projectData = JSON.parse(pageContent.innerText || JSON.stringify(fallbackPages));
	const rawBlocks = parse<AstroComponentBlocks>(root.dataset.blocks as string);
	const componentKeys = parse<string[]>(root.dataset.compkeys as string);

	const pluginList: CreateEditorOptions['plugins'] = [getPlugin(componentKeys)];

	// Check if plugins is a function or an array
	if (typeof plugins === 'function') {
		pluginList.push(...plugins({ plugins: pluginList }));
	} else if (Array.isArray(plugins)) {
		pluginList.push(...plugins);
	}

	return {
		licenseKey,
		plugins: pluginList,
		pages: false,
		root,
		project: fallbackProject,
		blocks: {
			default: convertComponentBlocks(rawBlocks),
		},
		assets: {
			storageType: 'self',
		},
		storage: {
			type: 'self',
			// Provide a custom handler for saving the project data.
			onSave: async ({ project, editor }) => {
				pageContent.innerText = JSON.stringify({
					...project,
					__STUDIOCMS_HTML: await generateHTML(editor),
				});
			},
			onLoad: async () => ({ project: projectData }),
			autosaveChanges: 50,
			autosaveIntervalMs: 10000,
		},
		layout: {
			default: {
				type: 'row',
				style: { height: '100%' },
				children: [
					{
						type: 'column',
						style: { padding: 5, gap: 5, borderRightWidth: 1, zIndex: 20, alignItems: 'center' },
						children: [
							{
								type: 'button',
								icon: 'layers',
								editorEvents: {
									'studio:layoutToggle:layoutId1': ({ fromEvent, setState }) =>
										setState({ active: fromEvent.isOpen }),
								},
								onClick: ({ editor }) => {
									editor.runCommand('studio:layoutRemove', { id: 'layoutId2' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId3' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId4' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId5' });
									editor.runCommand('studio:layoutToggle', {
										id: 'layoutId1',
										layout: { type: 'panelPagesLayers' },
										header: { label: 'Layers' },
										placer: { type: 'absolute', position: 'left' },
										style: { marginLeft: 42 },
									});
								},
							},
							{
								type: 'button',
								icon: 'viewGridPlus',
								editorEvents: {
									'studio:layoutToggle:layoutId2': ({ fromEvent, setState }) =>
										setState({ active: fromEvent.isOpen }),
								},
								onClick: ({ editor }) => {
									editor.runCommand('studio:layoutRemove', { id: 'layoutId1' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId3' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId4' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId5' });
									editor.runCommand('studio:layoutToggle', {
										id: 'layoutId2',
										layout: { type: 'panelBlocks' },
										header: { label: 'Blocks' },
										placer: { type: 'absolute', position: 'left' },
										style: { marginLeft: 42 },
									});
								},
							},
							{
								type: 'button',
								icon: 'target',
								editorEvents: {
									'studio:layoutToggle:layoutId3': ({ fromEvent, setState }) =>
										setState({ active: fromEvent.isOpen }),
								},
								onClick: ({ editor }) => {
									editor.runCommand('studio:layoutRemove', { id: 'layoutId1' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId2' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId4' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId5' });
									editor.runCommand('studio:layoutToggle', {
										id: 'layoutId3',
										layout: { type: 'panelSelectors' },
										header: { label: 'Selectors' },
										placer: { type: 'absolute', position: 'left' },
										style: { marginLeft: 42, padding: 6 },
									});
								},
							},
							{
								type: 'button',
								icon: 'paletteSwatch',
								editorEvents: {
									'studio:layoutToggle:layoutId4': ({ fromEvent, setState }) =>
										setState({ active: fromEvent.isOpen }),
								},
								onClick: ({ editor }) => {
									editor.runCommand('studio:layoutRemove', { id: 'layoutId1' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId2' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId3' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId5' });
									editor.runCommand('studio:layoutToggle', {
										id: 'layoutId4',
										layout: { type: 'panelStyles' },
										header: { label: 'Styles' },
										placer: { type: 'absolute', position: 'left' },
										style: { marginLeft: 42, padding: 6 },
									});
								},
							},
							{
								type: 'button',
								icon: 'cog',
								editorEvents: {
									'studio:layoutToggle:layoutId5': ({ fromEvent, setState }) =>
										setState({ active: fromEvent.isOpen }),
								},
								onClick: ({ editor }) => {
									editor.runCommand('studio:layoutRemove', { id: 'layoutId1' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId2' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId3' });
									editor.runCommand('studio:layoutRemove', { id: 'layoutId4' });
									editor.runCommand('studio:layoutToggle', {
										id: 'layoutId5',
										layout: { type: 'panelProperties' },
										header: { label: 'Properties' },
										placer: { type: 'absolute', position: 'left' },
										style: { marginLeft: 42, padding: 6 },
									});
								},
							},
						],
					},
					{
						type: 'column',
						style: { height: '100%', width: '100%' },
						children: [
							{
								type: 'sidebarTop',
								leftContainer: false,
								rightContainer: {
									buttons: [
										{
											id: 'undo',
											icon: 'arrowULeftTop',
											disabled: !0,
											onClick: ({ editor }) => editor.runCommand('core:undo'),
											editorEvents: {
												'change:changesCount': ({ setState, editor }) =>
													setState({ disabled: !editor.UndoManager.hasUndo() }),
											},
										},
										{
											id: 'redo',
											icon: 'arrowURightTop',
											disabled: !0,
											onClick: ({ editor }) => editor.runCommand('core:redo'),
											editorEvents: {
												'change:changesCount': ({ setState, editor }) =>
													setState({ disabled: !editor.UndoManager.hasRedo() }),
											},
										},
										{
											id: 'store',
											icon: 'floppy',
											tooltip: 'Save Changes',
											onClick: async ({ editor }) => editor.store(),
										},
									],
								},
							},
							{ type: 'canvas', grow: true },
						],
					},
				],
			},
		},
	};
}
