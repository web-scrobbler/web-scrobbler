export interface ApiCallResult {
	/**
	 * Get an ID of a scrobbler that created the result.
	 *
	 * @return Scrobbler ID
	 */
	getScrobblerId(): string;

	/**
	 * Get an additional information related to the result.
	 *
	 * @return Context info
	 */
	getContextInfo(): unknown;

	/**
	 * Set an additional information related to the result.
	 *
	 * @param contextInfo Context info
	 */
	setContextInfo(contextInfo: unknown): void;
}
