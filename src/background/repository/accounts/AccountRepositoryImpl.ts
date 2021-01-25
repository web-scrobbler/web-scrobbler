import { ScrobblerSession } from '@/background/account/ScrobblerSession';
import { UserAccount } from '@/background/account/UserAccount';
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

	async getAccount(scrobblerId: ScrobblerId): Promise<UserAccount> {
		const storage = this.getStorage(scrobblerId);
		const { sessionID, sessionName, properties } = await storage.get();

		const session = new ScrobblerSession(sessionID, sessionName);
		return new UserAccount(session, properties);
	}

	async removeAccount(scrobblerId: ScrobblerId): Promise<void> {
		const storage = this.getStorage(scrobblerId);
		await storage.clear();
	}

	async updateScrobblerSession(
		scrobblerId: ScrobblerId,
		session: ScrobblerSession
	): Promise<UserAccount> {
		const storage = this.getStorage(scrobblerId);

		await storage.update({
			sessionID: session.getId(),
			sessionName: session.getName(),
		});

		return this.getAccount(scrobblerId);
	}

	async updateUserProperties(
		scrobblerId: ScrobblerId,
		userProperties: UserProperties
	): Promise<UserAccount> {
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
