import { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';

import type { UserProperties } from '@/background/scrobbler/UserProperties';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

const unknownUsername = 'anonimous';

/**
 * Object that holds user account data.
 */
export class UserAccount {
	private readonly session: ScrobblerSession;
	private readonly userProperties: UserProperties;

	/**
	 * Create new Account object.
	 *
	 * @param scrobblerId Scrobbler ID
	 * @param [session] Scrobbler session
	 * @param [userProperties] User properties
	 */
	constructor(
		private readonly scrobblerId: ScrobblerId,
		session?: ScrobblerSession,
		userProperties?: UserProperties
	) {
		this.session = session ?? ScrobblerSession.createEmptySession();
		this.userProperties = userProperties ?? {};
	}

	/**
	 * Get scrobbler ID.
	 *
	 * @return Scrobbler ID
	 */
	getScrobblerId(): ScrobblerId {
		return this.scrobblerId;
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
	 * Get username.
	 *
	 * @return Username
	 */
	getUsername(): string {
		return this.getSession().getName() ?? unknownUsername;
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
