export interface ConnectorsOptions<D> {
	/**
	 * Return option value for a connector with the given connector ID.
	 *
	 * @param connectorId Connector ID
	 * @param optionKey Option key
	 *
	 * @return Option value
	 */
	getOption<I extends keyof D, K extends keyof D[I]>(
		connectorId: I,
		optionKey: K
	): Promise<D[I][K]>;

	/**
	 * Set option value for a connector with the given connector ID.
	 *
	 * @param connectorId Connector ID
	 * @param optionKey Option key
	 * @param optionValue Option value
	 */
	setOption<I extends keyof D, K extends keyof D[I], V extends D[I][K]>(
		connectorId: I,
		optionKey: K,
		optionValue: V
	): Promise<void>;
}
