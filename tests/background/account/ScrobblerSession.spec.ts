import { expect } from 'chai';

import { describeModuleTest } from '#/helpers/util';

import { ScrobblerSession } from '@/background/account/ScrobblerSession';

describeModuleTest(__filename, () => {
	it('should return true for empty session', () => {
		const session = ScrobblerSession.createEmptySession();

		expect(session.isEmpty()).to.be.true;
	});

	it('should return false for session with ID and name', () => {
		const session = new ScrobblerSession('id', 'name');

		expect(session.isEmpty()).to.be.false;
	});

	it('should return false for session with ID only', () => {
		const session = new ScrobblerSession('id');

		expect(session.isEmpty()).to.be.false;
	});
});
