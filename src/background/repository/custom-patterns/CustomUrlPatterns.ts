/**
 * Repository that provides custom URL patterns for connectors.
 */
export interface CustomUrlPatterns {
	/**
	 * Get custom URL patterns for a connector with the given ID.
	 *
	 * @param connectorId Connector ID
	 *
	 * @return Custom URL patterns
	 */
	getPatterns(connectorId: string): Promise<string[]>;

	/**
	 * Set custom URL patterns for a connector with the given ID.
	 *
	 * @param connectorId Connector ID
	 * @param patterns List of custom URL patterns
	 */
	setPatterns(connectorId: string, patterns: string[]): Promise<void>;

	/**
	 * Remove custom URL patterns for a connector with the given ID.
	 *
	 * @param connectorId Connector ID
	 */
	deletePatterns(connectorId: string): Promise<void>;
}
