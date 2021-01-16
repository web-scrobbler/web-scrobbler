import { Account } from '@/background/account/Account';
import { Session } from '@/background/account/Session';
import { UserProperties } from '@/background/account/UserProperties';
import { AccountsRepository } from '@/background/repository/accounts/AccountsRepository';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { createLocalStorage } from '@/background/storage2/namespace/NamespaceStorageFactory';
import { Storage } from '@/background/storage2/Storage';

interface AccountsRepositoryData {
	sessionID: string;
	sessionName: string;
	properties: UserProperties;
}

export class AccountsRepositoryImpl implements AccountsRepository {
	private storageNameMap: Record<ScrobblerId, string> = {
		[ScrobblerId.LastFm]: 'LastFM',
		[ScrobblerId.LibreFm]: 'LibreFM',
		[ScrobblerId.ListenBrainz]: 'ListenBrainz',
		[ScrobblerId.Maloja]: 'Maloja',
	};

	async getAccount(scrobblerId: ScrobblerId): Promise<Account> {
		const storageName = this.storageNameMap[scrobblerId];
		const storage = this.getStorage(storageName);

		const { sessionID, sessionName, properties } = await storage.get();
		return {
			session: {
				sessionId: sessionID,
				sessionName,
			},
			userProperties: properties,
		};
	}

	updateSession(scrobblerId: ScrobblerId, session: Session): Promise<void> {
		throw new Error('Method not implemented.');
	}

	updateUserProperties(
		scrobblerId: ScrobblerId,
		properties: UserProperties
	): Promise<void> {
		throw new Error('Method not implemented.');
	}

	private getStorage(storageName: string): Storage<AccountsRepositoryData> {
		return createLocalStorage(storageName);
	}
}
