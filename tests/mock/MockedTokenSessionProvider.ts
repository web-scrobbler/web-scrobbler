import { dummySessionData } from '#/stub/DummySession';
import { Session } from '@/background/account/Session';
import {
	SessionData,
	TokenBasedSessionProvider,
} from '@/background/scrobbler/service/TokenBasedSessionProvider';

export class MockedTokenBasedSessionProvider
	implements TokenBasedSessionProvider {
	private failRequestToken = false;
	private failRequestSession = false;

	constructor({ failRequestToken = false, failRequestSession = false } = {}) {
		this.failRequestSession = failRequestSession;
		this.failRequestToken = failRequestToken;
	}

	requestToken(): Promise<string> {
		if (this.failRequestToken) {
			throw new Error('Unable to request token');
		}

		return Promise.resolve(mockedToken);
	}

	getAuthUrl(token: string): string {
		return `https://example.com/request?token=${token}`;
	}

	requestSession(token: string): Promise<SessionData> {
		if (this.failRequestSession) {
			throw new Error(`Unable to request session with '${token}' token`);
		}

		return Promise.resolve(dummySessionData);
	}
}

export const mockedToken = 'token';
