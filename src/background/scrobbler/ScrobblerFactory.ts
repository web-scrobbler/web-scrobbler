import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import { LastFmScrobbler } from '@/background/scrobbler/LastFmScrobbler';
import { LibreFmScrobbler } from '@/background/scrobbler/LibreFmScrobbler';
import { ListenBrainzScrobbler } from '@/background/scrobbler/ListenBrainzScrobbler';
import { MalojaScrobbler } from '@/background/scrobbler/MalojaScrobbler';

import { defaultApiUrl } from '@/background/scrobbler/service/listenbrainz/ListenBrainzScrobblerService';

import type { Session } from '@/background/account/Session';
import type { Scrobbler } from '@/background/scrobbler/Scrobbler';
import type { UserProperties } from '@/background/account/UserProperties';

type FactoryFunction = (
	session: Session,
	properties: UserProperties
) => Scrobbler;

const factoryFunctions: Record<ScrobblerId, FactoryFunction> = {
	[ScrobblerId.LastFm]: createLastFmScrobbler,
	[ScrobblerId.LibreFm]: createLibreFmScrobbler,
	[ScrobblerId.ListenBrainz]: createListenBrainzScrobbler,
	[ScrobblerId.Maloja]: createMalojaScrobbler,
};

export function createScrobbler(
	scrobblerId: ScrobblerId,
	session: Session,
	userProperties: UserProperties
): Scrobbler {
	const factoryFunction = factoryFunctions[scrobblerId];

	return factoryFunction(session, userProperties);
}

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
