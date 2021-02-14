import type { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';

export interface ScrobblerAuthenticator {
	/**
	 * Request a session.
	 *
	 * @return Scrobbler session
	 */
	requestSession(): Promise<ScrobblerSession>;
}
