import { expect } from 'chai';

import { describeModuleTest } from '#/helpers/util';
import { dummySession } from '#/stub/DummySession';

import { ScrobblerId } from '@/background/scrobbler/ScrobblerId';
import { ScrobblerSession } from '@/background/scrobbler/ScrobblerSession';
import { GeneralScrobblerFactory } from '@/background/scrobbler/GeneralScrobblerFactory';

describeModuleTest(__filename, () => {
	const factory = new GeneralScrobblerFactory();

	it('should not create scrobbler with empty session', () => {
		const session = ScrobblerSession.createEmptySession();

		expect(() =>
			factory.createScrobbler(ScrobblerId.LastFm, session)
		).to.throw('Cannot create a scrobbler with empty session');
	});

	it('should create Scrobbler instance for each scrobbler ID', () => {
		for (const scrobblerId of Object.values(ScrobblerId)) {
			const scrobbler = factory.createScrobbler(
				scrobblerId,
				dummySession
			);

			expect(scrobbler.getId()).equals(scrobblerId);
		}
	});
});
