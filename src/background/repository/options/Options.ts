/**
 * Options repository.
 */
export interface Options {
	getOption<T>(key: string): Promise<T>;
	setOption<T>(key: string, value: T): Promise<void>;

	/**
	 * Check if a connector with the given connector ID is enabled.
	 *
	 * @param connectorId Connector ID
	 *
	 * @return Check result
	 */
	isConnectorEnabled(connectorId: string): Promise<boolean>;

	/**
	 * Enable or disable a connector with the given connector ID.
	 *
	 * @param connectorId Connector ID
	 * @param state True if connector is enabled; false otherwise
	 */
	setConnectorEnabled(connectorId: string, state: boolean): Promise<void>;

	/**
	 * Enable or disable all connectors.
	 *
	 * @param isEnabled True if connector is enabled; false otherwise
	 */
	setConnectorsEnabled(
		connectorId: string[],
		isEnabled: boolean
	): Promise<void>;
}
