import { AudioScrobblerScrobbleService } from '@/background/scrobbler/audioscrobbler/AudioScrobblerScrobbleService';
import { LastFmAppInfo } from '@/background/scrobbler/audioscrobbler/LastFmAppInfo';
import { LibreFmAppInfo } from '@/background/scrobbler/audioscrobbler/LibreFmAppInfo';
import { LibreFmScrobbleService } from '@/background/scrobbler/audioscrobbler/LibreFmScrobbleService';
import {
	ListenBrainzScrobblerService,
	defaultApiUrl,
} from '@/background/scrobbler/listenbrainz/ListenBrainzScrobblerService';
import { ListenBrainzSessionProvider } from '@/background/scrobbler/listenbrainz/ListenBrainzSessionProvider';
import { MalojaScrobbleService } from '@/background/scrobbler/maloja/MalojaScrobbleService';
import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';

import { assertUnreachable } from '@/background/util/util';
import { lastFmScrobblerInfo } from '@/background/scrobbler/audioscrobbler/LastFmScrobblerInfo';
import { libreFmScrobblerInfo } from '@/background/scrobbler/audioscrobbler/LibreFmScrobblerInfo';
import { listenbrainzScrobblerInfo } from '@/background/scrobbler/listenbrainz/ListenBrainzScrobblerInfo';
import { malojaScrobblerInfo } from '@/background/scrobbler/maloja/MalojaScrobblerInfo';

import type { ScrobblerFactory } from '@/background/scrobbler/ScrobblerFactory';
import type { SessionProviderFactory } from '@/background/scrobbler/SessionProviderFactory';
import type { TokenBasedSessionProvider } from '@/background/scrobbler/session-provider/TokenBasedSessionProvider';
import type { UserProperties } from '@/background/scrobbler/UserProperties';
import type { WebSessionProvider } from '@/background/scrobbler/session-provider/WebSessionProvider';

export class GeneralScrobblerFactory
	implements ScrobblerFactory, SessionProviderFactory {
	private tokenBasedAuthScrobblerIds = [
		ScrobblerId.LastFm,
		ScrobblerId.LibreFm,
	];
	private webAuthScrobblerIds = [ScrobblerId.ListenBrainz];

	createScrobbler(
		scrobblerId: ScrobblerId,
		session: ScrobblerSession,
		properties?: UserProperties
	): Scrobbler {
		if (session.isEmpty()) {
			throw new Error('Cannot create a scrobbler with empty session');
		}

		switch (scrobblerId) {
			case ScrobblerId.LastFm:
				return this.createLastFmScrobbler(session);

			case ScrobblerId.LibreFm:
				return this.createLibreFmScrobbler(session);

			case ScrobblerId.ListenBrainz:
				return this.createListenBrainzScrobbler(session, properties);

			case ScrobblerId.Maloja:
				return this.createMalojaScrobbler(session, properties);

			default:
				return assertUnreachable(scrobblerId);
		}
	}

	createTokenBasedSessionProvider(
		scrobblerId: ScrobblerId
	): TokenBasedSessionProvider {
		const dummySession = ScrobblerSession.createEmptySession();

		switch (scrobblerId) {
			case ScrobblerId.LastFm:
				return this.createLastFmScrobbleService(dummySession);

			case ScrobblerId.LibreFm:
				return this.createLibreFmScrobbleService(dummySession);

			default:
				throw new TypeError(
					`Scrobbler with ${scrobblerId} ID does not support token based authentication`
				);
		}
	}

	createWebSessionProvider(scrobblerId: ScrobblerId): WebSessionProvider {
		switch (scrobblerId) {
			case ScrobblerId.ListenBrainz:
				return new ListenBrainzSessionProvider();

			default:
				throw new TypeError(
					`Scrobbler with ${scrobblerId} ID does not support web authentication`
				);
		}
	}

	isTokenBasedAuthSupported(scrobblerId: ScrobblerId): boolean {
		return this.tokenBasedAuthScrobblerIds.includes(scrobblerId);
	}

	isWebAuthSupported(scrobblerId: ScrobblerId): boolean {
		return this.webAuthScrobblerIds.includes(scrobblerId);
	}

	private createLastFmScrobbler(session: ScrobblerSession): Scrobbler {
		const lastFmScrobbleService = this.createLastFmScrobbleService(session);

		return new Scrobbler(
			session,
			lastFmScrobblerInfo,
			lastFmScrobbleService
		);
	}

	private createLastFmScrobbleService(
		session: ScrobblerSession
	): AudioScrobblerScrobbleService {
		return new AudioScrobblerScrobbleService(session, LastFmAppInfo);
	}

	private createLibreFmScrobbler(session: ScrobblerSession): Scrobbler {
		const libreFmScrobbleService = this.createLibreFmScrobbleService(
			session
		);

		return new Scrobbler(
			session,
			libreFmScrobblerInfo,
			libreFmScrobbleService
		);
	}

	private createLibreFmScrobbleService(
		session: ScrobblerSession
	): LibreFmScrobbleService {
		return new LibreFmScrobbleService(session, LibreFmAppInfo);
	}

	private createListenBrainzScrobbler(
		session: ScrobblerSession,
		userProperties: UserProperties
	): Scrobbler {
		const { apiUrl = defaultApiUrl } = userProperties;
		const listenBrainzScrobbleService = new ListenBrainzScrobblerService(
			session,
			apiUrl
		);

		return new Scrobbler(
			session,
			listenbrainzScrobblerInfo,
			listenBrainzScrobbleService
		);
	}

	private createMalojaScrobbler(
		session: ScrobblerSession,
		userProperties: UserProperties
	): Scrobbler {
		const { apiUrl } = userProperties;
		const malojaScrobbleService = new MalojaScrobbleService(
			session,
			apiUrl
		);

		return new Scrobbler(
			session,
			malojaScrobblerInfo,
			malojaScrobbleService
		);
	}
}
