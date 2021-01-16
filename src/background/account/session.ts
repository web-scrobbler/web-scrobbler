import { UserProperties } from '@/background/account/UserProperties';

const emptySessionName: string = null;

/**
 * Object containing information required to send requests to
 * scrobbling services.
 */
export interface Session {
	sessionId: string;
	sessionName: string;
}

export function isSessionEmpty(session: Session): boolean {
	return !session.sessionId;
}

/**
 * Create a Session object with nullable properties.
 *
 * @return Session info
 */
export function createEmptySession(): Session {
	return { sessionId: null, sessionName: null };
}

/**
 * Create a Session object from user properties.
 *
 * @param properties User properties
 *
 * @return Session info
 */
export function createSessionFromUserProperties(
	properties: UserProperties
): Session {
	const { token } = properties;

	if (!token) {
		throw new Error('Unable to fetch session');
	}

	return {
		sessionId: token,
		sessionName: emptySessionName,
	};
}
