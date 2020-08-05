import { expect } from 'chai';

import { createApiCallResultStub, scrobblerIdStub } from '#/helpers/create-stubs';
import { getTestName } from '#/helpers/util';

import { ApiCallResult } from '@/background/scrobbler/api-call-result';

const { RESULT_OK, RESULT_IGNORE } = ApiCallResult;

describe(getTestName(__filename), () => {
	it('should return scrobbler ID', () => {
		const result = createApiCallResultStub(RESULT_OK);
		expect(result.getScrobblerId()).to.be.equal(scrobblerIdStub);
	});

	it('should return true for correct type', () => {
		const result = createApiCallResultStub(RESULT_OK);
		expect(result.is(RESULT_OK)).to.be.true;
	});

	it('should return false for other type', () => {
		const result = createApiCallResultStub(RESULT_OK);
		expect(result.is(RESULT_IGNORE)).to.be.false;
	});

	it('should have no context info by default', () => {
		const result = createApiCallResultStub(RESULT_OK);
		expect(result.getContextInfo()).to.be.null;
	});

	it('should return context info attached', () => {
		const contextInfo = { test: true };

		const result = createApiCallResultStub(RESULT_OK);
		result.setContextInfo(contextInfo);

		expect(result.getContextInfo()).to.be.deep.equal(contextInfo);
	});
});
