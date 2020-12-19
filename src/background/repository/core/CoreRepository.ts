/**
 * Repository that provides internal core data.
 */
export interface CoreRepository {
	/**
	 * Return an extension version saved previously.
	 *
	 * @return Extension version in semver format
	 */
	getExtensionVersion(): Promise<string>;

	/**
	 * Set an extension version to read it later.
	 *
	 * @param version Extension version in semver format
	 */
	setExtensionVersion(version: string): Promise<void>;
}
