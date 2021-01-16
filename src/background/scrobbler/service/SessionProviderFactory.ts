import { AudioScrobblerScrobbleService } from '@/background/scrobbler/service/audioscrobbler/AudioScrobblerScrobbleService';
import { TokenBasedSessionProvider } from '@/background/scrobbler/service/TokenBasedSessionProvider';

import { createEmptySession } from '@/background/account/Session';

import { LastFmAppInfo } from '@/background/scrobbler/service/audioscrobbler/LastFmAppInfo';
import { LibreFmAppInfo } from '@/background/scrobbler/service/audioscrobbler/LibreFmAppInfo';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { WebSessionProvider } from '@/background/scrobbler/service/WebSessionProvider';
import { ListenBrainzSessionProvider } from '@/background/scrobbler/service/listenbrainz/ListenBrainzSessionProvider';

type TokenBasedAuthScrobblerId = ScrobblerId.LastFm | ScrobblerId.LibreFm;
type TokenBasedSessionProviderFactory = () => TokenBasedSessionProvider;
const tokenBasedSessionProviderFactoryFunctions: Record<
	TokenBasedAuthScrobblerId,
	TokenBasedSessionProviderFactory
> = {
	[ScrobblerId.LastFm]: createLastFmSessionProvider,
	[ScrobblerId.LibreFm]: createLibreFmSessionProvider,
};

type WebAuthScrobblerId = ScrobblerId.ListenBrainz;
type WebSessionProviderFactory = () => WebSessionProvider;
const webSessionProviderFactoryFunctions: Record<
	WebAuthScrobblerId,
	WebSessionProviderFactory
> = {
	[ScrobblerId.ListenBrainz]: createListenBrainzSessionProvider,
};

/**
 * Create a token based session provider for a scrobbler with the given
 * scrobbler ID.
 *
 * @param scrobblerId ID of scrobbler that uses token based authentication
 *
 * @return Session provider
 * @throws Throw an rrror if the scrobbler with the given ID does not support auth via token
 */
export function createTokenBasedSessionProvider(
	scrobblerId: TokenBasedAuthScrobblerId
): TokenBasedSessionProvider {
	const factoryFunction =
		tokenBasedSessionProviderFactoryFunctions[scrobblerId];
	return factoryFunction();
}

/**
 * Create a web  session provider for a scrobbler with the given scrobbler ID.
 *
 * @param scrobblerId ID of scrobbler that uses web authentication
 *
 * @return Session provider
 * @throws Throw an rrror if the scrobbler with the given ID does not support auth via web
 */
export function createWebSessionProvider(
	scrobblerId: WebAuthScrobblerId
): WebSessionProvider {
	const factoryFunction = webSessionProviderFactoryFunctions[scrobblerId];
	return factoryFunction();
}

/**
 * Check if a scrobbler with the given ID uses token based authentication.
 *
 * @param scrobblerId Scrobbler ID
 *
 * @return Check result
 */
export function isTokenBasedAuthSupported(
	scrobblerId: string
): scrobblerId is TokenBasedAuthScrobblerId {
	return scrobblerId in tokenBasedSessionProviderFactoryFunctions;
}

/**
 * Check if a scrobbler with the given ID uses web authentication.
 *
 * @param scrobblerId Scrobbler ID
 *
 * @return Check result
 */
export function isWebAuthSupported(
	scrobblerId: string
): scrobblerId is WebAuthScrobblerId {
	return scrobblerId in webSessionProviderFactoryFunctions;
}

function createLastFmSessionProvider(): TokenBasedSessionProvider {
	return new AudioScrobblerScrobbleService(
		createEmptySession(),
		LastFmAppInfo
	);
}

function createLibreFmSessionProvider(): TokenBasedSessionProvider {
	return new AudioScrobblerScrobbleService(
		createEmptySession(),
		LibreFmAppInfo
	);
}

function createListenBrainzSessionProvider(): WebSessionProvider {
	return new ListenBrainzSessionProvider();
}
