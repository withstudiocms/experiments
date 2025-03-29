type Shared = {
	sanitize: import('ultrahtml/transformers/sanitize').SanitizeOptions;
};

declare global {
	var studiocmsWYSIWYGStudio: Shared;
}

/**
 * A shared object used across the WYSIWYG Studio module. This object is either retrieved
 * from the global `studiocmsWYSIWYGStudio` property or initialized as a new object with
 * default properties if it does not already exist.
 *
 * @remarks
 * The `sanitize` property is initialized as an empty object and can be used to store
 * sanitization-related configurations or utilities.
 */
export const shared: Shared =
	globalThis.studiocmsWYSIWYGStudio ||
	// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
	(globalThis.studiocmsWYSIWYGStudio = {
		sanitize: {},
	});
