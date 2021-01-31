export enum InjectResult {
	/**
	 * All content scripts are already injected.
	 */
	Injected,

	/**
	 * The connector is matched and all content scripts are injected.
	 */
	Matched,

	/**
	 * The connector is not matched.
	 */
	NoMatch,
}
