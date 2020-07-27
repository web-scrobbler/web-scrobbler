/**
 * The object representing an entry from `connectors.json`.
 */
export interface ConnectorEntry {
	/**
	 * The connector ID. This value must be unique.
	 *
	 * This property is used internally in the extension. Do not change
	 * the value of this property a serious reason.
	 *
	 * Ref: https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development#how-to-assign-id-for-a-website
	 */
	id: string;

	/**
	 * A path to the connector file.
	 *
	 * Ref: https://github.com/web-scrobbler/web-scrobbler/wiki/Connectors-development#how-to-name-connector-file
	 */
	js: string;

	/**
	 * A website label.
	 */
	label: string;

	/**
	 * An array of match patterns.
	 *
	 * https://developer.chrome.com/extensions/match_patterns
	 */
	matches?: string[];

	/**
	 * Allow or disallow injecting the connector into all frames.
	 *
	 * https://developer.chrome.com/extensions/content_scripts#frames
	 */
	allFrames?: boolean;
}
