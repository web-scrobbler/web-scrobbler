import type { TabOpener } from '@/background/authenticator/tab-opener/TabOpener';
import type { ScrobblerAuthenticator } from '@/background/authenticator/ScrobblerAuthenticator';
import type { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import type { TokenBasedSessionProvider } from '@/background/scrobbler/session-provider/TokenBasedSessionProvider';

export class TokenAuthenticator implements ScrobblerAuthenticator {
	constructor(
		private tabOpener: TabOpener,
		private sessionProvider: TokenBasedSessionProvider
	) {}

	async requestSession(): Promise<ScrobblerSession> {
		const token = await this.sessionProvider.requestToken();
		await this.tabOpener(this.sessionProvider.getAuthUrl(token));

		return this.sessionProvider.requestSession(token);
	}
}
