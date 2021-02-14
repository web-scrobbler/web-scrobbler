import { expect } from 'chai';

import { TokenBasedSessionProviderStub } from '#/stub/TokenSessionProviderStub';
import { describeModuleTest } from '#/helpers/util';
import { dummySession } from '#/stub/DummySession';
import { tabOpenerStub } from '#/stub/TabOpenerStub';

import { TokenAuthenticator } from '@/background/authenticator/TokenAuthenticator';

import type { ScrobblerAuthenticator } from '@/background/authenticator/ScrobblerAuthenticator';
import type { TokenBasedSessionProvider } from '@/background/scrobbler/session-provider/TokenBasedSessionProvider';

describeModuleTest(__filename, () => {
	it('should return session', async () => {
		const authenticator = createTokenAuthenticator(
			new TokenBasedSessionProviderStub()
		);
		const session = await authenticator.requestSession();

		expect(session.getId()).to.be.deep.equal(dummySession.getId());
		expect(session.getName()).to.be.deep.equal(dummySession.getName());
	});

	it('should throw an error if requesting token is failed', () => {
		const authenticator = createTokenAuthenticator(
			new TokenBasedSessionProviderStub({ failRequestToken: true })
		);

		return expect(
			authenticator.requestSession()
		).to.eventually.rejectedWith('Unable to request token');
	});

	it('should throw an error if requesting session is failed', () => {
		const authenticator = createTokenAuthenticator(
			new TokenBasedSessionProviderStub({ failRequestSession: true })
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
	return new TokenAuthenticator(tabOpenerStub, sessionProvider);
}
