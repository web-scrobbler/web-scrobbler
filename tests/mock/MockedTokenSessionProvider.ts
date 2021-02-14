import { dummySession } from '#/stub/DummySession';

import type { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import type { TokenBasedSessionProvider } from '@/background/scrobbler/session-provider/TokenBasedSessionProvider';

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

	requestSession(token: string): Promise<ScrobblerSession> {
		if (this.failRequestSession) {
			throw new Error(`Unable to request session with '${token}' token`);
		}

		return Promise.resolve(dummySession);
	}
}

export const mockedToken = 'token';
