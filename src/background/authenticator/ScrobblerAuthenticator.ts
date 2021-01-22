import type { ScrobblerSession } from '@/background/account/ScrobblerSession';

export interface ScrobblerAuthenticator {
	/**
	 * Request a session.
	 *
	 * @return Scrobbler session
	 */
	requestSession(): Promise<ScrobblerSession>;
}
