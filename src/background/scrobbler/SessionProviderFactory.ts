import type { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import type { TokenBasedSessionProvider } from '@/background/scrobbler/session-provider/TokenBasedSessionProvider';
import type { WebSessionProvider } from '@/background/scrobbler/session-provider/WebSessionProvider';

/**
 * Object that creates session providers.
 */
export interface SessionProviderFactory {
	/**
	 * Create a token based session provider for a scrobbler with the given
	 * scrobbler ID.
	 *
	 * @param scrobblerId ID of scrobbler that uses token based authentication
	 *
	 * @return Session provider
	 * @throws Throw an rrror if the scrobbler with the given ID does not support auth via token
	 */
	createTokenBasedSessionProvider(
		scrobblerId: ScrobblerId
	): TokenBasedSessionProvider;

	/**
	 * Create a web  session provider for a scrobbler with the given scrobbler ID.
	 *
	 * @param scrobblerId ID of scrobbler that uses web authentication
	 *
	 * @return Session provider
	 * @throws Throw an rrror if the scrobbler with the given ID does not support auth via web
	 */
	createWebSessionProvider(scrobblerId: ScrobblerId): WebSessionProvider;

	/**
	 * Check if a scrobbler with the given ID uses token based authentication.
	 *
	 * @param scrobblerId Scrobbler ID
	 *
	 * @return Check result
	 */
	isTokenBasedAuthSupported(scrobblerId: ScrobblerId): boolean;

	/**
	 * Check if a scrobbler with the given ID uses web authentication.
	 *
	 * @param scrobblerId Scrobbler ID
	 *
	 * @return Check result
	 */
	isWebAuthSupported(scrobblerId: ScrobblerId): boolean;
}
