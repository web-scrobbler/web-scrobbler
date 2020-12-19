export interface ConnectorsOptions<D> {
	getOption<I extends keyof D, K extends keyof D[I]>(
		connectorId: I,
		optionKey: K
	): Promise<D[I][K]>;

	setOption<I extends keyof D, K extends keyof D[I], V extends D[I][K]>(
		connectorId: I,
		optionKey: K,
		optionValue: V
	): Promise<void>;
}
