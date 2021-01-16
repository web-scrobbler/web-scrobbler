import { dummySessionData } from '#/stub/DummySession';

import { SessionData } from '@/background/scrobbler/service/TokenBasedSessionProvider';
import { WebSessionProvider } from '@/background/scrobbler/service/WebSessionProvider';

export class MockedWebSessionProvider implements WebSessionProvider {
	private failRequestSession = false;

	constructor({ failRequestSession = false } = {}) {
		this.failRequestSession = failRequestSession;
	}

	getAuthUrl(): string {
		return 'https://example.com/auth';
	}

	requestSession(): Promise<SessionData> {
		if (this.failRequestSession) {
			throw new Error('Unable to request session');
		}

		return Promise.resolve(dummySessionData);
	}
}
