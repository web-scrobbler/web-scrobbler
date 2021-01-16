import { Account } from '@/background/account/Account';
import { Session } from '@/background/account/Session';
import { UserProperties } from '@/background/account/UserProperties';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export interface AccountsRepository {
	getAccount(scrobblerId: string): Promise<Account>;

	updateSession(scrobblerId: ScrobblerId, session: Session): Promise<void>;
	updateUserProperties(
		scrobblerId: ScrobblerId,
		properties: UserProperties
	): Promise<void>;
}
