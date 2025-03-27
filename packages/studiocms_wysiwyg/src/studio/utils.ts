import type { CreateEditorOptions, StorageConfig, WithEditorProps } from '@grapesjs/studio-sdk';

export const firstUpperCase = (text: string) => {
	if (text.length > 1) {
		const p1 = text.slice(0, 1);
		const p2 = text.slice(1);
		return `${p1.toUpperCase()}${p2}`;
	}
	return text;
};

export const getPlugin = (componentKeys: string[]) => (editor: WithEditorProps['editor']) => {
	editor.DomComponents.addType('astro-component', {
		isComponent: (el) => componentKeys.includes(el.tagName.toLowerCase()),
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

export const fallbackProject = {
	default: {
		pages: [{ component: '<h1>Fallback Project, reload to retry</h1>' }],
	},
};

export type AstroComponentBlocks = {
	id: string;
	label: string;
	category: string;
	media: string;
	key: string;
}[];

export type AstroComponentEditorBlocks = {
	id: string;
	label: string;
	category: string;
	media: string;
	content: () => string;
}[];

export function convertComponentBlocks(blocks: AstroComponentBlocks): AstroComponentEditorBlocks {
	return blocks.map(({ key, ...block }) => ({
		...block,
		content: () => `<${key}></${key}>`,
	}));
}

export function parse<T extends object>(data: string): T {
	return JSON.parse(data) as T;
}

export const generateHTML = async (editor: WithEditorProps['editor']): Promise<string> => {
	const files = await editor.runCommand('studio:projectFiles', { styles: 'inline' });
	// For simplicity, we'll "publish" only the first page.
	const firstPage = files.find((file: { mimeType: string }) => file.mimeType === 'text/html');
	const pageHTML = firstPage.content as string;
	return pageHTML;
};

export function getEditorSettings(
	licenseKey: string,
	root: HTMLElement,
	pageContent: HTMLElement
): CreateEditorOptions {
	const projectData = JSON.parse(pageContent.innerText);

	const rawBlocks = parse<AstroComponentBlocks>(root.dataset.blocks as string);
	const componentKeys = parse<string[]>(root.dataset.compkeys as string);

	const blocks = {
		default: convertComponentBlocks(rawBlocks),
	};

	const storage: StorageConfig = {
		type: 'self',
		// Provide a custom handler for saving the project data.
		onSave: async ({ project, editor }) => {
			pageContent.innerText = JSON.stringify({
				...project,
				__STUDIOCMS_HTML: await generateHTML(editor),
			});
		},
		onLoad: async () => ({
			project: projectData || {
				pages: [{ component: '<h1>New project</h1>' }],
			},
		}),
		autosaveChanges: 100,
		autosaveIntervalMs: 10000,
	};

	return {
		licenseKey,
		plugins: [getPlugin(componentKeys)],
		pages: false,
		root,
		project: fallbackProject,
		blocks,
		storage,
		assets: {
			storageType: 'self',
		},
	};
}

export const AstroSVG: string =
	'<svg xmlns="http://www.w3.org/2000/svg" style="width:48px;height:48px" viewBox="0 0 24 24"><path fill="currentColor" d="M9.24 19.035c-.901-.826-1.164-2.561-.789-3.819c.65.793 1.552 1.044 2.486 1.186c1.44.218 2.856.137 4.195-.524c.153-.076.295-.177.462-.278c.126.365.159.734.115 1.11c-.107.915-.56 1.622-1.283 2.158c-.289.215-.594.406-.892.608c-.916.622-1.164 1.35-.82 2.41l.034.114a2.4 2.4 0 0 1-1.07-.918a2.6 2.6 0 0 1-.412-1.401c-.003-.248-.003-.497-.036-.74c-.081-.595-.36-.86-.883-.876a1.034 1.034 0 0 0-1.075.843q-.013.058-.033.126M4.1 15.007s2.666-1.303 5.34-1.303l2.016-6.26c.075-.304.296-.51.544-.51c.25 0 .47.206.545.51l2.016 6.26c3.167 0 5.34 1.303 5.34 1.303L15.363 2.602c-.13-.366-.35-.602-.645-.602H9.283c-.296 0-.506.236-.645.602c-.01.024-4.538 12.405-4.538 12.405"/></svg>';
