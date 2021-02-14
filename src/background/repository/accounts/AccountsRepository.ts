import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import type { UserAccount } from '@/background/account/UserAccount';
import type { UserProperties } from '@/background/scrobbler/UserProperties';

export interface AccountsRepository extends AsyncIterable<UserAccount> {
	/**
	 * Get the user account for a scrobbler with the given ID.
	 *
	 * @param scrobblerId Scrobbler ID
	 *
	 * @return User account
	 */
	getAccount(scrobblerId: ScrobblerId): Promise<UserAccount>;

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
		session: ScrobblerSession
	): Promise<UserAccount>;

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
	): Promise<UserAccount>;
}
