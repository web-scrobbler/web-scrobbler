const emptySessionName: string = null;

/**
 * Object that holds session data.
 */
export class ScrobblerSession {
	/**
	 * Create a new ScrobblerSession object.
	 *
	 * @param id Session ID
	 * @param name Session name (username)
	 */
	constructor(
		private readonly id: string,
		private readonly name: string = emptySessionName
	) {}

	/**
	 * Get session ID.
	 *
	 * @return Session ID
	 */
	getId(): string {
		return this.id;
	}

	/**
	 * Get session name (username).
	 *
	 * @return Session name
	 */
	getName(): string {
		return this.name;
	}

	/**
	 * Check if the session is empty. Empty session means it has no ID.
	 *
	 * @return Check result
	 */
	isEmpty(): boolean {
		return !this.id;
	}

	/**
	 * Create a ScrobblerSession object with empty data.
	 *
	 * @return Empty ScrobblerSession object
	 */
	static createEmptySession(): ScrobblerSession {
		return new ScrobblerSession(null);
	}
}
