import { expect } from 'chai';

import { describeModuleTest } from '#/helpers/util';
import { dummySession } from '#/stub/DummySession';

import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import { createScrobbler } from '@/background/scrobbler/ScrobblerFactory';

describeModuleTest(__filename, () => {
	it('should not create scrobbler with empty session', () => {
		// const account = new UserAccount(ScrobblerId.LastFm);
		const session = ScrobblerSession.createEmptySession();

		expect(() => createScrobbler(ScrobblerId.LastFm, session)).to.throw(
			'Cannot create scrobbler with empty session'
		);
	});

	it('should create Scrobbler instance for each scrobbler ID', () => {
		for (const scrobblerId of Object.values(ScrobblerId)) {
			const scrobbler = createScrobbler(scrobblerId, dummySession);

			expect(scrobbler.getId()).equals(scrobblerId);
		}
	});
});
