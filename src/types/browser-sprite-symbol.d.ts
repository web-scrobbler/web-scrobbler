/**
 * Type declarations for `svg-sprite-loader`.
 */

declare module '*.svg' {
	interface BrowserSpriteSymbol {
		content: string;
		id: string;
		node: Node;
		viewBox: string;
	}

	const browserSpriteSymbol: BrowserSpriteSymbol;
	export default browserSpriteSymbol;
}
