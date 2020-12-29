export interface Scrobbler {
	/**
	 * Get the scrobbler ID. The ID must be unique.
	 */
	getId(): string;

	/**
	 * Get the scrobbler label.
	 */
	getLabel(): string;

	/**
	 * Get URL to profile page.
	 *
	 * @return Profile URL
	 */
	getProfileUrl(): string;

	/**
	 * Get status page URL.
	 */
	getStatusUrl(): string;

	/**
	 * Request an auth URL where user should grant permission to the extension.
	 *
	 * @return Auth URL
	 */
	requestAuthUrl(): Promise<string>;

	/**
	 * Sign out.
	 */
	signOut(): Promise<void>;
}
