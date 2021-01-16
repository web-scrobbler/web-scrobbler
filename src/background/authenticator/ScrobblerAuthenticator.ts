import type { Session } from '@/background/account/Session';

export interface ScrobblerAuthenticator {
	/**
	 * Request a session.
	 *
	 * @return Session
	 */
	requestSession(): Promise<Session>;
}
