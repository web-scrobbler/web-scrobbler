import { expect } from 'chai';

import ApiCallResult from '@/background/object/api-call-result';

const { RESULT_OK, RESULT_IGNORE } = ApiCallResult;
const stubScobblerId = 'stub-id';

function runTests() {
	it('should return scrobbler ID', () => {
		const result = createResult();
		expect(result.getScrobblerId()).to.be.equal(stubScobblerId);
	});

	it('should return scrobbler ID', () => {
		expect(createInvalidResult).to.throw();
	});

	it('should return true for correct type', () => {
		const result = createResult();
		expect(result.is(RESULT_OK)).to.be.true;
	});

	it('should return false for other type', () => {
		const result = createResult();
		expect(result.is(RESULT_IGNORE)).to.be.false;
	});

	it('should have no context info by default', () => {
		const result = createResult();
		expect(result.getContextInfo()).to.be.null;
	});

	it('should return context info attached', () => {
		const contextInfo = { test: true };

		const result = createResult();
		result.setContextInfo(contextInfo);

		expect(result.getContextInfo()).to.be.deep.equal(contextInfo);
	});
}

function createResult() {
	return new ApiCallResult(RESULT_OK, stubScobblerId);
}

function createInvalidResult() {
	return new ApiCallResult('invalid-result-type-for-tests', stubScobblerId);
}

runTests();
