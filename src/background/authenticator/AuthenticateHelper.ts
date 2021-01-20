import { AccountsRepository } from '@/background/repository/accounts/AccountsRepository';
import { ScrobblerAuthenticatorFactory } from '@/background/authenticator/ScrobblerAuthenticatorFactory';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';
import { UserProperties } from '@/background/account/UserProperties';

import { ScrobblerFactory } from '@/background/scrobbler/ScrobblerFactory';

export class AuthenticateHelper {
	constructor(
		private scrobbleManager: ScrobblerManager,
		private accountsRepository: AccountsRepository,
		private scrobblerFactory: ScrobblerFactory,
		private authenticatorFactory: ScrobblerAuthenticatorFactory
	) {}

	async signIn(scrobblerId: ScrobblerId): Promise<void> {
		const authenticator = this.authenticatorFactory(scrobblerId);
		const session = await authenticator.requestSession();

		const account = await this.accountsRepository.updateSession(
			scrobblerId,
			session
		);

		const scrobbler = this.scrobblerFactory(scrobblerId, account);
		this.scrobbleManager.useScrobbler(scrobbler);
	}

	async updateUserProperties(
		scrobblerId: ScrobblerId,
		userProperties: UserProperties
	): Promise<void> {
		const account = await this.accountsRepository.updateUserProperties(
			scrobblerId,
			userProperties
		);

		const scrobbler = this.scrobblerFactory(scrobblerId, account);
		this.scrobbleManager.useScrobbler(scrobbler);
	}

	async signOut(scrobblerId: ScrobblerId): Promise<void> {
		await this.accountsRepository.removeAccount(scrobblerId);
		this.scrobbleManager.removeScrobbler(scrobblerId);
	}
}
