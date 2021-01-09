/**
 * Ref: https://www.last.fm/api/desktopauth
 */

/**
 * A session provider using a token-based authentication.
 *
 * Steps for requesting a session data:
 * 1. Request a new token.
 * 2. Get a URL using the token and open this URL.
 * 3. Wait once a user grants access to the application.
 * 4. Request a session using the token.
 */
export interface TokenBasedSessionProvider {
	/**
	 * Request a new token from the provider.
	 *
	 * @return Token
	 */
	requestToken(): Promise<string>;

	/**
	 * Create an URL to a page where a user should grant access to
	 * the extension. Once the user grants access, the given token will be
	 * valid.
	 *
	 * @param token Token
	 *
	 * @return Auth URL
	 */
	getAuthUrl(token: string): string;

	/**
	 * Request a session data with the given token.
	 *
	 * @param token Token
	 *
	 * @return Session data
	 */
	requestSession(token: string): Promise<SessionData>;
}

/**
 * Response from the TokenBasedSessionProvider.
 */
export interface SessionData {
	/**
	 * Session key.
	 */
	key: string;

	/**
	 * Session name.
	 */
	name: string;
}
