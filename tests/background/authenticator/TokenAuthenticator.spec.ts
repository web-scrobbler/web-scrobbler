import { expect } from 'chai';

import { MockedTabOpener } from '#/mock/MockedTabOpener';
import { MockedTokenBasedSessionProvider } from '#/mock/MockedTokenSessionProvider';
import { getTestName } from '#/helpers/util';
import { dummySession } from '#/stub/DummySession';

import { TokenAuthenticator } from '@/background/authenticator/TokenAuthenticator';

import type { ScrobblerAuthenticator } from '@/background/authenticator/ScrobblerAuthenticator';
import { TokenBasedSessionProvider } from '@/background/scrobbler/service/TokenBasedSessionProvider';

describe(getTestName(__filename), () => {
	it('should return session', async () => {
		const authenticator = createTokenAuthenticator(
			new MockedTokenBasedSessionProvider()
		);
		const session = await authenticator.requestSession();

		expect(session).to.be.deep.equal(dummySession);
	});

	it('should throw an error if requesting token is failed', () => {
		const authenticator = createTokenAuthenticator(
			new MockedTokenBasedSessionProvider({ failRequestToken: true })
		);

		return expect(
			authenticator.requestSession()
		).to.eventually.rejectedWith('Unable to request token');
	});

	it('should throw an error if requesting session is failed', () => {
		const authenticator = createTokenAuthenticator(
			new MockedTokenBasedSessionProvider({ failRequestSession: true })
		);

		return expect(
			authenticator.requestSession()
		).to.eventually.rejectedWith(
			"Unable to request session with 'token' token"
		);
	});
});

function createTokenAuthenticator(
	sessionProvider: TokenBasedSessionProvider
): ScrobblerAuthenticator {
	return new TokenAuthenticator(MockedTabOpener, sessionProvider);
}
