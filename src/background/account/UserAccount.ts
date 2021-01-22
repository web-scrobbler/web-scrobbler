import { ScrobblerSession } from '@/background/account/ScrobblerSession';
import type { UserProperties } from '@/background/account/UserProperties';

/**
 * Object that holds user account data.
 */
export class UserAccount {
	private readonly session: ScrobblerSession;
	private readonly userProperties: UserProperties;

	/**
	 * Create new Account object.
	 *
	 * @param session Scrobbler session
	 * @param userProperties User properties
	 */
	constructor(session?: ScrobblerSession, userProperties?: UserProperties) {
		this.session = session ?? ScrobblerSession.createEmptySession();
		this.userProperties = userProperties ?? {};
	}

	/**
	 * Get scrobbler session. If user properties contain session-related info,
	 * return a new scrobbler session created with that info.
	 *
	 * @return Scrobbler session
	 */
	getSession(): ScrobblerSession {
		if (this.userProperties.token) {
			return new ScrobblerSession(this.userProperties.token);
		}

		return this.session;
	}

	/**
	 * Get user properties.
	 *
	 * @return User properties
	 */
	getUserProperties(): UserProperties {
		return this.userProperties;
	}
}
