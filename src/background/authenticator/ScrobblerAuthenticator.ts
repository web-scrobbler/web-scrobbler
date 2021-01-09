import { Session } from '@/background/account/Session';

export interface ScrobblerAuthenticator {
	requestSession(): Promise<Session>;
}
