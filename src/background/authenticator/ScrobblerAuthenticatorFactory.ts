import { browserTabOpener } from '@/background/authenticator/tab-opener/BrowserTabOpener';

import type { ScrobblerAuthenticator } from '@/background/authenticator/ScrobblerAuthenticator';
import { TokenAuthenticator } from '@/background/authenticator/TokenAuthenticator';
import { WebAuthenticator } from '@/background/authenticator/WebAuthenticator';

import {
	createTokenBasedSessionProvider,
	createWebSessionProvider,
	isTokenBasedAuthSupported,
	isWebAuthSupported,
} from '@/background/scrobbler/service/SessionProviderFactory';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

export function createAuthenticator(
	scrobblerId: ScrobblerId
): ScrobblerAuthenticator {
	if (isTokenBasedAuthSupported(scrobblerId)) {
		const sessionProvider = createTokenBasedSessionProvider(scrobblerId);
		return new TokenAuthenticator(browserTabOpener, sessionProvider);
	}

	if (isWebAuthSupported(scrobblerId)) {
		const sessionProvider = createWebSessionProvider(scrobblerId);
		return new WebAuthenticator(browserTabOpener, sessionProvider);
	}

	throw new Error(
		`Unable to create authenticator for scrobbler with "${scrobblerId}" ID`
	);
}
