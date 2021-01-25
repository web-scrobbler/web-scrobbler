import type { AccountsRepository } from '@/background/repository/accounts/AccountsRepository';
import type { AuthenticationWorker } from '@/background/authenticator/AuthenticationWorker';
import type { ScrobblerAuthenticatorFactory } from '@/background/authenticator/ScrobblerAuthenticatorFactory';
import type { ScrobblerFactory } from '@/background/scrobbler/ScrobblerFactory';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';
import type { UserAccount } from '@/background/account/UserAccount';
import type { UserProperties } from '@/background/account/UserProperties';

export class AuthenticationWorkerImpl implements AuthenticationWorker {
	constructor(
		private scrobbleManager: ScrobblerManager,
		private accountsRepository: AccountsRepository,
		private scrobblerFactory: ScrobblerFactory,
		private authenticatorFactory: ScrobblerAuthenticatorFactory
	) {}

	async signIn(
		scrobblerId: ScrobblerId,
		userProperties?: UserProperties
	): Promise<void> {
		let account: UserAccount;

		if (userProperties) {
			account = await this.accountsRepository.updateUserProperties(
				scrobblerId,
				userProperties
			);
		} else {
			const authenticator = this.authenticatorFactory(scrobblerId);
			const session = await authenticator.requestSession();

			account = await this.accountsRepository.updateScrobblerSession(
				scrobblerId,
				session
			);
		}

		const scrobbler = this.scrobblerFactory(account);
		this.scrobbleManager.useScrobbler(scrobbler);
	}

	async signOut(scrobblerId: ScrobblerId): Promise<void> {
		await this.accountsRepository.removeAccount(scrobblerId);
		this.scrobbleManager.removeScrobbler(scrobblerId);
	}
}
