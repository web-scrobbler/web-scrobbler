import { ScrobblerAuthenticator } from '@/background/authenticator/ScrobblerAuthenticator';
import { Session } from '@/background/account/Session';
import { WebSessionProvider } from '@/background/scrobbler/service/WebSessionProvider';
import { TabOpener } from '@/background/authenticator/tab-opener/TabOpener';

export class WebAuthenticator implements ScrobblerAuthenticator {
	constructor(
		private tabOpener: TabOpener,
		private sessionProvider: WebSessionProvider
	) {}

	async requestSession(): Promise<Session> {
		const authUrl = this.sessionProvider.getAuthUrl();
		await this.tabOpener(authUrl);

		try {
			const { key, name } = await this.sessionProvider.requestSession();
			return { sessionId: key, sessionName: name };
		} catch {
			throw new Error('Unable to request session');
		}
	}
}
