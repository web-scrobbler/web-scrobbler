import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import {
	AccountInfo,
	createEmptyAccountInfo,
} from '@/communication/accounts/AccountInfo';
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
import type { UserProperties } from '@/background/scrobbler/UserProperties';
import { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';

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
				return this.getAccountInfoList();
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

	private async getAccountInfoList(): Promise<ReadonlyArray<AccountInfo>> {
		const accountInfoArr: AccountInfo[] = [];

		for (const scrobblerId of Object.values(ScrobblerId)) {
			const account = await this.accountsRepository.getAccount(
				scrobblerId
			);

			const acccountInfo = this.getAccountInfo(account);
			accountInfoArr.push(acccountInfo);
		}

		return accountInfoArr;
	}

	private async signIn(
		scrobblerId: ScrobblerId,
		userProperties?: UserProperties
	): Promise<void> {
		if (userProperties) {
			await this.accountsRepository.updateUserProperties(
				scrobblerId,
				userProperties
			);
		} else {
			const session = await this.requestSession(scrobblerId);
			await this.accountsRepository.updateScrobblerSession(
				scrobblerId,
				session
			);
		}

		const account = await this.accountsRepository.getAccount(scrobblerId);
		return this.useAccountForScrobbler(account, scrobblerId);
	}

	private async signOut(scrobblerId: ScrobblerId): Promise<void> {
		await this.accountsRepository.removeAccount(scrobblerId);
		this.scrobbleManager.removeScrobbler(scrobblerId);
	}

	private getAccountInfo(account: UserAccount): AccountInfo {
		const scrobblerId = account.getScrobblerId();
		const scrobbler = this.scrobbleManager.getScrobblerById(scrobblerId);
		if (!scrobbler) {
			return createEmptyAccountInfo(scrobblerId);
		}

		return {
			username: account.getUsername(),
			profileUrl: scrobbler.getProfileUrl(),
			scrobblerId: scrobbler.getId(),
			scrobblerLabel: getScrobblerLabel(scrobbler.getId()),
		};
	}

	private requestSession(
		scrobblerId: ScrobblerId
	): Promise<ScrobblerSession> {
		const authenticator = this.authenticatorFactory(scrobblerId);
		return authenticator.requestSession();
	}

	private useAccountForScrobbler(
		account: UserAccount,
		scrobblerId: ScrobblerId
	): void {
		const session = account.getSession();
		const properties = account.getUserProperties();

		const scrobbler = this.scrobblerFactory(
			scrobblerId,
			session,
			properties
		);
		this.scrobbleManager.useScrobbler(scrobbler);
	}
}
