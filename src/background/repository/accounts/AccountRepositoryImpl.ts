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
		const storage = this.getStorage(scrobblerId);

		const { sessionID, sessionName, properties } = await storage.get();
		return {
			session: {
				sessionId: sessionID,
				sessionName: sessionName,
			},
			userProperties: properties,
		};
	}

	removeAccount(scrobblerId: ScrobblerId): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async updateSession(
		scrobblerId: ScrobblerId,
		session: Session
	): Promise<Account> {
		const storage = this.getStorage(scrobblerId);

		await storage.update({
			sessionID: session.sessionId,
			sessionName: session.sessionName,
		});

		return this.getAccount(scrobblerId);
	}

	async updateUserProperties(
		scrobblerId: ScrobblerId,
		userProperties: UserProperties
	): Promise<Account> {
		const storage = this.getStorage(scrobblerId);

		await storage.update({
			properties: userProperties,
		});

		return this.getAccount(scrobblerId);
	}

	private getStorage(
		scrobblerId: ScrobblerId
	): Storage<AccountsRepositoryData> {
		const storageName = this.storageNameMap[scrobblerId];
		return createLocalStorage(storageName);
	}
}
