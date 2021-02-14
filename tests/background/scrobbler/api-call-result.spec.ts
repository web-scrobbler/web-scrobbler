import { expect } from 'chai';

import {
	createScrobblerResultStub,
	scrobblerIdStub,
} from '#/helpers/create-stubs';
import { describeModuleTest } from '#/helpers/util';

import { ScrobblerResult } from '@/background/scrobbler/ScrobblerResult';

describeModuleTest(__filename, () => {
	it('should return scrobbler ID', () => {
		const result = createScrobblerResultStub(ScrobblerResult.RESULT_OK);
		expect(result.getScrobblerId()).to.be.equal(scrobblerIdStub);
	});

	it('should return true for correct type', () => {
		const result = createScrobblerResultStub(ScrobblerResult.RESULT_OK);
		expect(result.is(ScrobblerResult.RESULT_OK)).to.be.true;
	});

	it('should return false for other type', () => {
		const result = createScrobblerResultStub(ScrobblerResult.RESULT_OK);
		expect(result.is(ScrobblerResult.RESULT_IGNORE)).to.be.false;
	});

	it('should return false for non-error result', () => {
		const resultOk = createScrobblerResultStub(ScrobblerResult.RESULT_OK);
		expect(resultOk.isError()).to.be.false;

		const resultIgnored = createScrobblerResultStub(
			ScrobblerResult.RESULT_IGNORE
		);
		expect(resultIgnored.isError()).to.be.false;
	});

	it('should return true for error result', () => {
		const errorAuth = createScrobblerResultStub(ScrobblerResult.ERROR_AUTH);
		expect(errorAuth.isError()).to.be.true;

		const errorOther = createScrobblerResultStub(
			ScrobblerResult.ERROR_OTHER
		);
		expect(errorOther.isError()).to.be.true;
	});

	it('should have no context info by default', () => {
		const result = createScrobblerResultStub(ScrobblerResult.RESULT_OK);
		expect(result.getContextInfo()).to.be.null;
	});

	it('should return context info attached', () => {
		const contextInfo = { test: true };

		const result = createScrobblerResultStub(ScrobblerResult.RESULT_OK);
		result.setContextInfo(contextInfo);

		expect(result.getContextInfo()).to.be.deep.equal(contextInfo);
	});
});
