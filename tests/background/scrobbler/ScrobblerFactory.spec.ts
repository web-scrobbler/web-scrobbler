import { expect } from 'chai';

import { describeModuleTest } from '#/helpers/util';
import { dummySession } from '#/stub/DummySession';

import { UserAccount } from '@/background/account/UserAccount';
import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';

import { createScrobbler } from '@/background/scrobbler/ScrobblerFactory';

describeModuleTest(__filename, () => {
	it('should not create scrobbler with empty session', () => {
		const account = new UserAccount(ScrobblerId.LastFm);

		expect(() => createScrobbler(account)).to.throw(
			'Cannot create scrobbler with empty session'
		);
	});

	it('should create Scrobbler instance for each scrobbler ID', () => {
		for (const scrobblerId of Object.values(ScrobblerId)) {
			const account = new UserAccount(scrobblerId, dummySession);
			const scrobbler = createScrobbler(account);

			expect(scrobbler.getId()).equals(scrobblerId);
		}
	});
});
