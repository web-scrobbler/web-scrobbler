import { expect } from 'chai';

import { getTestName } from '#/helpers/util';

import { UserAccount } from '@/background/account/UserAccount';
import { ScrobblerSession } from '@/background/account/ScrobblerSession';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

describe(getTestName(__filename), () => {
	const stubSessionId = 'stubId';
	const stubSessionName = 'stubName';
	const stubToken = 'stubToken';

	const stubSession = new ScrobblerSession(stubSessionId, stubSessionName);
	const stubUserProperties = { token: stubToken };

	it('should return empty session by default', () => {
		const account = new UserAccount(ScrobblerId.LastFm);

		expect(account.getSession()).to.be.eql(
			ScrobblerSession.createEmptySession()
		);
	});

	it('should return empty user properties by default', () => {
		const account = new UserAccount(ScrobblerId.LastFm);

		expect(account.getUserProperties()).to.be.empty;
	});

	it('should return proper session', () => {
		const account = new UserAccount(ScrobblerId.LastFm, stubSession);
		const session = account.getSession();

		expect(session.getId()).to.equal(stubSessionId);
		expect(session.getName()).to.equal(stubSessionName);
	});

	it('should return proper user properties', () => {
		const account = new UserAccount(
			ScrobblerId.LastFm,
			stubSession,
			stubUserProperties
		);
		const userProperties = account.getUserProperties();

		expect(userProperties.token).to.equal(stubToken);
	});

	it('should prefer session from user properties', () => {
		const account = new UserAccount(
			ScrobblerId.LastFm,
			stubSession,
			stubUserProperties
		);
		const session = account.getSession();

		expect(session.getId()).to.equal(stubToken);
		expect(session.getName()).to.be.null;
	});
});
