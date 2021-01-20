import { Account } from '@/background/account/Account';
import { Session } from '@/background/account/Session';
import { UserProperties } from '@/background/account/UserProperties';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export interface AccountsRepository {
	getAccount(scrobblerId: ScrobblerId): Promise<Account>;
	removeAccount(scrobblerId: ScrobblerId): Promise<void>;

	updateSession(scrobblerId: ScrobblerId, session: Session): Promise<Account>;

	updateUserProperties(
		scrobblerId: ScrobblerId,
		properties: UserProperties
	): Promise<Account>;
}
