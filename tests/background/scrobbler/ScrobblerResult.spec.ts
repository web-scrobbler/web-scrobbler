import { expect } from 'chai';

import {
	createScrobblerResultStub,
	scrobblerIdStub,
} from '#/helpers/create-stubs';
import { describeModuleTest } from '#/helpers/util';

import { ScrobblerResultType } from '@/background/scrobbler/ScrobblerResult';

describeModuleTest(__filename, () => {
	it('should return scrobbler ID', () => {
		const result = createScrobblerResultStub(ScrobblerResultType.OK);
		expect(result.getScrobblerId()).to.be.equal(scrobblerIdStub);
	});

	it('should return true for correct type', () => {
		const result = createScrobblerResultStub(ScrobblerResultType.OK);
		expect(result.is(ScrobblerResultType.OK)).to.be.true;
	});

	it('should return false for other type', () => {
		const result = createScrobblerResultStub(ScrobblerResultType.OK);
		expect(result.is(ScrobblerResultType.IGNORED)).to.be.false;
	});

	it('should return false for non-error result', () => {
		const resultOk = createScrobblerResultStub(ScrobblerResultType.OK);
		expect(resultOk.isError()).to.be.false;

		const resultIgnored = createScrobblerResultStub(
			ScrobblerResultType.IGNORED
		);
		expect(resultIgnored.isError()).to.be.false;
	});

	it('should return true for error result', () => {
		const errorAuth = createScrobblerResultStub(
			ScrobblerResultType.ERROR_AUTH
		);
		expect(errorAuth.isError()).to.be.true;

		const errorOther = createScrobblerResultStub(
			ScrobblerResultType.ERROR_OTHER
		);
		expect(errorOther.isError()).to.be.true;
	});

	it('should have no context info by default', () => {
		const result = createScrobblerResultStub(ScrobblerResultType.OK);
		expect(result.getContextInfo()).to.be.null;
	});

	it('should return context info attached', () => {
		const contextInfo = { test: true };

		const result = createScrobblerResultStub(ScrobblerResultType.OK);
		result.setContextInfo(contextInfo);

		expect(result.getContextInfo()).to.be.deep.equal(contextInfo);
	});
});
