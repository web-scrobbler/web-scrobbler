import { browserTabOpener } from '@/background/authenticator/tab-opener/BrowserTabOpener';

import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { TokenAuthenticator } from '@/background/authenticator/TokenAuthenticator';
import { WebAuthenticator } from '@/background/authenticator/WebAuthenticator';

import type { ScrobblerAuthenticator } from '@/background/authenticator/ScrobblerAuthenticator';
import type { SessionProviderFactory } from '@/background/scrobbler/SessionProviderFactory';

/**
 * Object that creates scrobbler authenticators.
 */
export class ScrobblerAuthenticatorFactory {
	constructor(private factory: SessionProviderFactory) {}

	/**
	 * Create an authenticator for a scrobbler with the given scrobbler ID.
	 *
	 * @param scrobblerId Scrobbler ID
	 *
	 * @return Authenticator instance
	 * @throws Throws an error if the scrobbler does not support authentication via session
	 */
	createAuthenticator(scrobblerId: ScrobblerId): ScrobblerAuthenticator {
		if (this.factory.isTokenBasedAuthSupported(scrobblerId)) {
			const sessionProvider = this.factory.createTokenBasedSessionProvider(
				scrobblerId
			);
			return new TokenAuthenticator(browserTabOpener, sessionProvider);
		}

		if (this.factory.isWebAuthSupported(scrobblerId)) {
			const sessionProvider = this.factory.createWebSessionProvider(
				scrobblerId
			);
			return new WebAuthenticator(browserTabOpener, sessionProvider);
		}

		throw new Error(
			`Unable to create authenticator for scrobbler with "${scrobblerId}" ID`
		);
	}
}
