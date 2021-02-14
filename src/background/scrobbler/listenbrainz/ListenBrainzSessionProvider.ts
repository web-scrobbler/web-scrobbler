import { fetchDocument } from '@/background/util/fetch/FetchDocument';
import { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';

import type { WebSessionProvider } from '@/background/scrobbler/session-provider/WebSessionProvider';

export class ListenBrainzSessionProvider implements WebSessionProvider {
	private authUrl =
		'https://listenbrainz.org/login/musicbrainz?next=%2Fprofile%2F';
	private fetchSessionUrls = [
		'https://listenbrainz.org/profile/',
		this.authUrl,
	];

	getAuthUrl(): string {
		return this.authUrl;
	}

	requestSession(): Promise<ScrobblerSession> {
		for (const url of this.fetchSessionUrls) {
			try {
				return this.fetchSession(url);
			} catch {
				continue;
			}
		}

		throw new Error('Unable to fetch session');
	}

	private async fetchSession(url: string): Promise<ScrobblerSession> {
		// NOTE: Use 'same-origin' credentials to fix login on Firefox ESR 60.
		const { ok, data: doc } = await fetchDocument(url, {
			method: 'GET',
			credentials: 'same-origin',
		});

		if (!ok) {
			throw new Error('Unable to fetch session');
		}

		const usernameEl = doc.querySelector('.page-title');
		const authTokenEl = doc.querySelector('#auth-token');

		const username = usernameEl && usernameEl.textContent;
		const authToken = authTokenEl && authTokenEl.getAttribute('value');

		if (!authToken) {
			throw new Error('Unable to find auth token');
		}

		if (!username) {
			throw new Error('Unable to find username');
		}

		return new ScrobblerSession(authToken, username);
	}
}
