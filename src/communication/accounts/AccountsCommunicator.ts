import type { AccountInfo } from '@/background/model/AccountInfo';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { UserProperties } from '@/background/scrobbler/UserProperties';

export interface AccountsCommunicator {
	getAccounts(): Promise<ReadonlyArray<AccountInfo>>;

	/**
	 * Sign in to a service bound to a scrobbler with the given scrobbler ID.
	 * If user properties are passed, use them to sign in as well.
	 *
	 * @param scrobblerId Scrobbler ID
	 * @param [userProperties] UserProperties
	 */
	signIn(
		scrobblerId: ScrobblerId,
		userProperties?: UserProperties
	): Promise<void>;

	/**
	 * Sign out from a service bound to a scrobbler with the given scrobbler ID.
	 *
	 * @param scrobblerId Scrobbler ID
	 */
	signOut(scrobblerId: ScrobblerId): Promise<void>;
}
