import { expect } from 'chai';

import {
	createApiCallResultStub,
	scrobblerIdStub,
} from '#/helpers/create-stubs';
import { getTestName } from '#/helpers/util';

import { ApiCallResult } from '@/background/scrobbler/api-call-result';

describe(getTestName(__filename), () => {
	it('should return scrobbler ID', () => {
		const result = createApiCallResultStub(ApiCallResult.RESULT_OK);
		expect(result.getScrobblerId()).to.be.equal(scrobblerIdStub);
	});

	it('should return true for correct type', () => {
		const result = createApiCallResultStub(ApiCallResult.RESULT_OK);
		expect(result.is(ApiCallResult.RESULT_OK)).to.be.true;
	});

	it('should return false for other type', () => {
		const result = createApiCallResultStub(ApiCallResult.RESULT_OK);
		expect(result.is(ApiCallResult.RESULT_IGNORE)).to.be.false;
	});

	it('should return false for non-error result', () => {
		const resultOk = createApiCallResultStub(ApiCallResult.RESULT_OK);
		expect(resultOk.isError()).to.be.false;

		const resultIgnored = createApiCallResultStub(
			ApiCallResult.RESULT_IGNORE
		);
		expect(resultIgnored.isError()).to.be.false;
	});

	it('should return true for error result', () => {
		const errorAuth = createApiCallResultStub(ApiCallResult.ERROR_AUTH);
		expect(errorAuth.isError()).to.be.true;

		const errorOther = createApiCallResultStub(ApiCallResult.ERROR_OTHER);
		expect(errorOther.isError()).to.be.true;
	});

	it('should have no context info by default', () => {
		const result = createApiCallResultStub(ApiCallResult.RESULT_OK);
		expect(result.getContextInfo()).to.be.null;
	});

	it('should return context info attached', () => {
		const contextInfo = { test: true };

		const result = createApiCallResultStub(ApiCallResult.RESULT_OK);
		result.setContextInfo(contextInfo);

		expect(result.getContextInfo()).to.be.deep.equal(contextInfo);
	});
});
