/**
 * Object containing information required to send requests to
 * scrobbling services.
 */
export interface Session {
	sessionId: string;
	sessionName: string;
}

/**
 * Return a Session object with nullable properties.
 *
 * @return Session info
 */
export function createEmptySession(): Session {
	return { sessionId: null, sessionName: null };
}
