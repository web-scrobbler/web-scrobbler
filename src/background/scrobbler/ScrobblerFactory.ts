import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import {
	defaultApiUrl,
	ListenBrainzScrobblerService,
} from '@/background/scrobbler/listenbrainz/ListenBrainzScrobblerService';

import { Scrobbler } from '@/background/scrobbler/Scrobbler';
import type { UserProperties } from '@/background/account/UserProperties';
import type { UserAccount } from '@/background/account/UserAccount';
import type { ScrobblerSession } from '@/background/account/ScrobblerSession';

import { AudioScrobblerScrobbleService } from '@/background/scrobbler/audioscrobbler/AudioScrobblerScrobbleService';
import { LastFmAppInfo } from '@/background/scrobbler/audioscrobbler/LastFmAppInfo';
import { lastFmScrobblerInfo } from '@/background/scrobbler/audioscrobbler/LastFmScrobblerInfo';
import { LibreFmScrobbleService } from '@/background/scrobbler/audioscrobbler/LibreFmScrobbleService';
import { LibreFmAppInfo } from '@/background/scrobbler/audioscrobbler/LibreFmAppInfo';
import { libreFmScrobblerInfo } from '@/background/scrobbler/audioscrobbler/LibreFmScrobblerInfo';
import { listenbrainzScrobblerInfo } from '@/background/scrobbler/listenbrainz/ListenBrainzScrobblerInfo';
import { MalojaScrobbleService } from '@/background/scrobbler/maloja/MalojaScrobbleService';
import { malojaScrobblerInfo } from '@/background/scrobbler/maloja/MalojaScrobblerInfo';

/**
 * Function that creates a Scrobbler instance.
 *
 * @param scrobblerId Scrobbler ID
 * @param account User account
 *
 * @return Scrobbler object
 */
export interface ScrobblerFactory {
	(scrobblerId: ScrobblerId, account: UserAccount): Scrobbler;
}

export const createScrobbler: ScrobblerFactory = (
	scrobblerId: ScrobblerId,
	account: UserAccount
): Scrobbler => {
	const session = account.getSession();
	if (session.isEmpty()) {
		throw new Error('Cannot create scrobbler with empty session');
	}

	const userProperties = account.getUserProperties();

	const factoryFunction = factoryFunctions[scrobblerId];
	return factoryFunction(session, userProperties);
};

interface InternalFactoryFunction {
	(session: ScrobblerSession, properties: UserProperties): Scrobbler;
}

const factoryFunctions: Record<ScrobblerId, InternalFactoryFunction> = {
	[ScrobblerId.LastFm]: createLastFmScrobbler,
	[ScrobblerId.LibreFm]: createLibreFmScrobbler,
	[ScrobblerId.ListenBrainz]: createListenBrainzScrobbler,
	[ScrobblerId.Maloja]: createMalojaScrobbler,
};

function createLastFmScrobbler(session: ScrobblerSession): Scrobbler {
	const lastFmScrobbleService = new AudioScrobblerScrobbleService(
		session,
		LastFmAppInfo
	);

	return new Scrobbler(session, lastFmScrobblerInfo, lastFmScrobbleService);
}

function createLibreFmScrobbler(session: ScrobblerSession): Scrobbler {
	const libreFmScrobbleService = new LibreFmScrobbleService(
		session,
		LibreFmAppInfo
	);

	return new Scrobbler(session, libreFmScrobblerInfo, libreFmScrobbleService);
}

function createListenBrainzScrobbler(
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

function createMalojaScrobbler(
	session: ScrobblerSession,
	userProperties: UserProperties
): Scrobbler {
	const { apiUrl } = userProperties;
	const malojaScrobbleService = new MalojaScrobbleService(session, apiUrl);

	return new Scrobbler(session, malojaScrobblerInfo, malojaScrobbleService);
}
