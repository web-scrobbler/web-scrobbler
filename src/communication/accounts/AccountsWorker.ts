import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import {
	AccountInfo,
	createEmptyAccountInfo,
} from '@/background/model/AccountInfo';
import {
	AccountsMessageType,
	SignInPayload,
	SignOutPayload,
} from '@/communication/accounts/AccountsMessageType';

import { getScrobblerLabel } from '@/background/scrobbler/ScrobblerLabel';

import type { AccountsRepository } from '@/background/repository/accounts/AccountsRepository';
import type { Message } from '@/communication/message/Message';
import type { CommunicationWorker } from '@/communication/CommunicationWorker';
import type { ScrobblerAuthenticatorFactory } from '@/background/authenticator/ScrobblerAuthenticatorFactory';
import type { ScrobblerFactory } from '@/background/scrobbler/ScrobblerFactory';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';
import type { UserAccount } from '@/background/account/UserAccount';
import type { UserProperties } from '@/background/account/UserProperties';

export class AccountsWorker
	implements CommunicationWorker<AccountsMessageType, SignInPayload> {
	constructor(
		private scrobbleManager: ScrobblerManager,
		private accountsRepository: AccountsRepository,
		private scrobblerFactory: ScrobblerFactory,
		private authenticatorFactory: ScrobblerAuthenticatorFactory
	) {}

	canProcessMessage(message: Message<unknown, unknown>): boolean {
		// @ts-ignore
		return Object.values(AccountsMessageType).includes(message.type);
	}

	processMessage(
		message: Message<AccountsMessageType, unknown>
	): Promise<unknown> {
		const { type, data } = message;

		switch (type) {
			case AccountsMessageType.GetAccounts: {
				return this.getAccounts();
			}

			case AccountsMessageType.SignIn: {
				const { scrobblerId, userProperties } = data as SignInPayload;
				return this.signIn(scrobblerId, userProperties);
			}

			case AccountsMessageType.SignOut: {
				const { scrobblerId } = data as SignOutPayload;
				return this.signOut(scrobblerId);
			}
		}
	}

	private async getAccounts(): Promise<ReadonlyArray<AccountInfo>> {
		const accountInfoArr: AccountInfo[] = [];

		for (const scrobblerId of Object.values(ScrobblerId)) {
			const account = await this.accountsRepository.getAccount(
				scrobblerId
			);

			const acccountInfo =
				this.getAccountInfo(account) ||
				createEmptyAccountInfo(scrobblerId);

			accountInfoArr.push(acccountInfo);
		}

		return accountInfoArr;
	}

	private async signIn(
		scrobblerId: ScrobblerId,
		userProperties?: UserProperties
	): Promise<void> {
		const account = await this.getAccount(scrobblerId, userProperties);

		const scrobbler = this.scrobblerFactory(account);
		this.scrobbleManager.useScrobbler(scrobbler);
	}

	private async signOut(scrobblerId: ScrobblerId): Promise<void> {
		await this.accountsRepository.removeAccount(scrobblerId);
		this.scrobbleManager.removeScrobbler(scrobblerId);
	}

	private async getAccount(
		scrobblerId: ScrobblerId,
		userProperties?: UserProperties
	): Promise<UserAccount> {
		if (userProperties) {
			return await this.accountsRepository.updateUserProperties(
				scrobblerId,
				userProperties
			);
		}

		const authenticator = this.authenticatorFactory(scrobblerId);
		const session = await authenticator.requestSession();

		return await this.accountsRepository.updateScrobblerSession(
			scrobblerId,
			session
		);
	}

	private getAccountInfo(account: UserAccount): AccountInfo {
		const scrobblerId = account.getScrobblerId();
		const scrobbler = this.scrobbleManager.getScrobblerById(scrobblerId);
		if (!scrobbler) {
			return null;
		}

		return {
			username: account.getUsername(),
			profileUrl: scrobbler.getProfileUrl(),
			scrobblerId: scrobbler.getId(),
			scrobblerLabel: getScrobblerLabel(scrobbler.getId()),
		};
	}
}
