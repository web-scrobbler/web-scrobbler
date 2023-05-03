import { expect, describe, it, beforeAll, afterAll } from 'vitest';

import webextensionPolyfill from '#/mocks/webextension-polyfill';
import * as CustomPatterns from '@/core/storage/custom-patterns';

/**
 * Run all tests.
 */
function runTests() {
	describe('Test custom patterns', () => {
		beforeAll(() => {
			webextensionPolyfill.reset();
		});

		afterAll(() => {
			webextensionPolyfill.reset();
		});

		it('should return null before patterns have been configured', async () => {
			const data = await CustomPatterns.getAllPatterns();
			expect(data).to.be.null;
		});

		it('should set patterns for connector', async () => {
			const patterns = ['1', '2'];
			const expectedData = {
				connector: patterns,
			};
			await CustomPatterns.setPatterns('connector', patterns);
			const data = await CustomPatterns.getAllPatterns();
			expect(expectedData).to.deep.equal(data);
		});

		it('should clear custom patterns', async () => {
			await CustomPatterns.resetPatterns('connector');
			const data = await CustomPatterns.getAllPatterns();
			expect(data).to.deep.equal({});
		});
	});
}

runTests();
