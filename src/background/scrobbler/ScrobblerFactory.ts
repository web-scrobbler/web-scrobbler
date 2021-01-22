import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import { LastFmScrobbler } from '@/background/scrobbler/LastFmScrobbler';
import { LibreFmScrobbler } from '@/background/scrobbler/LibreFmScrobbler';
import { ListenBrainzScrobbler } from '@/background/scrobbler/ListenBrainzScrobbler';
import { MalojaScrobbler } from '@/background/scrobbler/MalojaScrobbler';

import { defaultApiUrl } from '@/background/scrobbler/service/listenbrainz/ListenBrainzScrobblerService';

import type { Scrobbler } from '@/background/scrobbler/Scrobbler';
import type { UserProperties } from '@/background/account/UserProperties';
import type { UserAccount } from '@/background/account/UserAccount';
import type { ScrobblerSession } from '@/background/account/ScrobblerSession';

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
) => {
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
	return new LastFmScrobbler(session);
}

function createLibreFmScrobbler(session: ScrobblerSession): Scrobbler {
	return new LibreFmScrobbler(session);
}

function createListenBrainzScrobbler(
	session: ScrobblerSession,
	userProperties: UserProperties
): Scrobbler {
	const { apiUrl = defaultApiUrl } = userProperties;

	return new ListenBrainzScrobbler(session, apiUrl);
}

function createMalojaScrobbler(
	session: ScrobblerSession,
	userProperties: UserProperties
): Scrobbler {
	const { apiUrl } = userProperties;

	return new MalojaScrobbler(session, apiUrl);
}
