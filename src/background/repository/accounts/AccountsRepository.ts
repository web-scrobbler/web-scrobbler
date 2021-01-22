import { Account } from '@/background/account/Account';
import { Session } from '@/background/account/Session';
import { UserProperties } from '@/background/account/UserProperties';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export interface AccountsRepository {
	/**
	 * Get the user account for a scrobbler with the given ID.
	 *
	 * @param scrobblerId Scrobbler ID
	 *
	 * @return User account
	 */
	getAccount(scrobblerId: ScrobblerId): Promise<Account>;

	/**
	 * Remove the user account for a scrobbler with the given ID.
	 *
	 * @param scrobblerId Scrobbler ID
	 */
	removeAccount(scrobblerId: ScrobblerId): Promise<void>;

	/**
	 * Update scrobbler session for a scrobbler with the given ID.
	 *
	 * @param scrobblerId Scrobbler ID
	 * @param session Scrobbler session
	 *
	 * @return User account with updated scrobbler session
	 */
	updateScrobblerSession(
		scrobblerId: ScrobblerId,
		session: Session
	): Promise<Account>;

	/**
	 * Update user properties for a scrobbler with the given ID.
	 *
	 * @param scrobblerId Scrobbler ID
	 * @param properties User properties
	 *
	 * @return User account with updated user properties
	 */
	updateUserProperties(
		scrobblerId: ScrobblerId,
		properties: UserProperties
	): Promise<Account>;
}
