import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import { LastFmScrobbler } from '@/background/scrobbler/LastFmScrobbler';
import { LibreFmScrobbler } from '@/background/scrobbler/LibreFmScrobbler';
import { ListenBrainzScrobbler } from '@/background/scrobbler/ListenBrainzScrobbler';
import { MalojaScrobbler } from '@/background/scrobbler/MalojaScrobbler';

import { defaultApiUrl } from '@/background/scrobbler/service/listenbrainz/ListenBrainzScrobblerService';

import {
	createSessionFromUserProperties,
	isSessionEmpty,
	Session,
} from '@/background/account/Session';

import type { Account } from '@/background/account/Account';
import type { Scrobbler } from '@/background/scrobbler/Scrobbler';
import type { UserProperties } from '@/background/account/UserProperties';

/**
 * Function that creates a Scrobbler instance.
 *
 * @param scrobblerId Scrobbler ID
 * @param account User account
 *
 * @return Scrobbler object
 */
export interface ScrobblerFactory {
	(scrobblerId: ScrobblerId, account: Account): Scrobbler;
}

export const createScrobbler: ScrobblerFactory = (
	scrobblerId: ScrobblerId,
	account: Account
) => {
	let { session, userProperties } = account;
	try {
		session = createSessionFromUserProperties(userProperties);
	} catch {}

	if (isSessionEmpty(session)) {
		throw new Error('Cannot create scrobbler with empty session');
	}

	const factoryFunction = factoryFunctions[scrobblerId];
	return factoryFunction(session, userProperties);
};

interface InternalFactoryFunction {
	(session: Session, properties: UserProperties): Scrobbler;
}

const factoryFunctions: Record<ScrobblerId, InternalFactoryFunction> = {
	[ScrobblerId.LastFm]: createLastFmScrobbler,
	[ScrobblerId.LibreFm]: createLibreFmScrobbler,
	[ScrobblerId.ListenBrainz]: createListenBrainzScrobbler,
	[ScrobblerId.Maloja]: createMalojaScrobbler,
};

function createLastFmScrobbler(session: Session): Scrobbler {
	return new LastFmScrobbler(session);
}

function createLibreFmScrobbler(session): Scrobbler {
	return new LibreFmScrobbler(session);
}

function createListenBrainzScrobbler(
	session: Session,
	userProperties: UserProperties
): Scrobbler {
	const { apiUrl = defaultApiUrl } = userProperties;

	return new ListenBrainzScrobbler(session, apiUrl);
}

function createMalojaScrobbler(
	session: Session,
	userProperties: UserProperties
): Scrobbler {
	const { apiUrl } = userProperties;

	return new MalojaScrobbler(session, apiUrl);
}
