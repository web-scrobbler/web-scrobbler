import { ScrobblerAuthenticator } from '@/background/authenticator/ScrobblerAuthenticator';
import { Session } from '@/background/account/Session';
import { SessionProvider } from '@/background/scrobbler/service/SessionProvider';
import { TabOpener } from '@/background/authenticator/TabOpener';

export class ListenBrainzAuthenticator implements ScrobblerAuthenticator {
	constructor(
		private tabOpener: TabOpener,
		private sessionProvider: SessionProvider
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
