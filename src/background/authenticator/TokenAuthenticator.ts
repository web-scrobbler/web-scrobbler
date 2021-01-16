import type { TabOpener } from '@/background/authenticator/tab-opener/TabOpener';

import { Session } from '@/background/account/Session';
import { ScrobblerAuthenticator } from '@/background/authenticator/ScrobblerAuthenticator';
import { TokenBasedSessionProvider } from '@/background/scrobbler/service/TokenBasedSessionProvider';

export class TokenAuthenticator implements ScrobblerAuthenticator {
	constructor(
		private tabOpener: TabOpener,
		private sessionProvider: TokenBasedSessionProvider
	) {}

	async requestSession(): Promise<Session> {
		const token = await this.sessionProvider.requestToken();
		await this.tabOpener(this.sessionProvider.getAuthUrl(token));

		const { key, name } = await this.sessionProvider.requestSession(token);
		return { sessionId: key, sessionName: name };
	}
}
