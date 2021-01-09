import { Account } from '@/background/account/Account';
import { AccountsRepository } from '@/background/repository/accounts/AccountsRepository';
import { createLocalStorage } from '@/background/storage2/namespace/NamespaceStorageFactory';
import { Storage } from '@/background/storage2/Storage';

interface AccountsRepositoryData {
	sessionID: string;
	sessionName: string;
}

export class AccountsRepositoryImpl implements AccountsRepository {
	private storageNameMap: Record<string, string> = {
		'last-fm': 'LastFM',
	};

	async getAccount(scrobblerId: string): Promise<Account> {
		if (scrobblerId in this.storageNameMap) {
			const storageName = this.storageNameMap[scrobblerId];
			const storage = this.getStorage(storageName);

			const { sessionID, sessionName } = await storage.get();
			return {
				session: {
					sessionId: sessionID,
					sessionName,
				},
				userProperties: {},
			};
		}

		throw new Error(`Unable to get account for ${scrobblerId} scrobbler`);
	}

	private getStorage(storageName: string): Storage<AccountsRepositoryData> {
		return createLocalStorage(storageName);
	}
}
