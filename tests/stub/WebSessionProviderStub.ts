import { dummySession } from '#/stub/DummySession';

import type { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import type { WebSessionProvider } from '@/background/scrobbler/session-provider/WebSessionProvider';

export class WebSessionProviderStub implements WebSessionProvider {
	private failRequestSession = false;

	constructor({ failRequestSession = false } = {}) {
		this.failRequestSession = failRequestSession;
	}

	getAuthUrl(): string {
		return 'https://example.com/auth';
	}

	requestSession(): Promise<ScrobblerSession> {
		if (this.failRequestSession) {
			throw new Error('Unable to request session');
		}

		return Promise.resolve(dummySession);
	}
}
