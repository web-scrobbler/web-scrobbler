import { AccountsMessageType } from '@/communication/accounts/AccountsMessageType';

import type { AccountInfo } from '@/background/model/AccountInfo';
import type { AccountsCommunicator } from '@/communication/accounts/AccountsCommunicator';
import type { MessageSender } from '@/communication/MessageSender';
import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { UserProperties } from '@/background/account/UserProperties';

export class AccountsCommunicatorImpl implements AccountsCommunicator {
	constructor(private sender: MessageSender<AccountsMessageType>) {}

	getAccounts(): Promise<readonly AccountInfo[]> {
		return this.sender.sendMessage({
			type: AccountsMessageType.GetAccounts,
		});
	}

	async signIn(
		scrobblerId: ScrobblerId,
		userProperties?: UserProperties
	): Promise<void> {
		return this.sender.sendMessage({
			type: AccountsMessageType.SignIn,
			data: {
				scrobblerId,
				userProperties,
			},
		});
	}

	signOut(scrobblerId: ScrobblerId): Promise<void> {
		return this.sender.sendMessage({
			type: AccountsMessageType.SignOut,
			data: {
				scrobblerId,
			},
		});
	}
}
