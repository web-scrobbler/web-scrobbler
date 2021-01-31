import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { UserProperties } from '@/background/account/UserProperties';

export enum AccountsMessageType {
	SignIn = 'SignIn',
	SignOut = 'SignOut',
	GetAccounts = 'GetAccounts',
}

export interface SignInPayload {
	scrobblerId: ScrobblerId;
	userProperties?: UserProperties;
}

export interface SignOutPayload {
	scrobblerId: ScrobblerId;
}
