import { expect } from 'chai';

import { AnyFunction, getFunctionName } from '#/helpers/util';

/**
 * An interface to describe test data used to test a function.
 */
export interface FunctionTestData<F extends AnyFunction> {
	/**
	 * Test case description.
	 */
	description: string;
	/**
	 * Function parateters.
	 */
	funcParameters: Parameters<F>;
	/**
	 * Expected value.
	 */
	expectedValue: ReturnType<F>;
}

/**
 * Wrap `testFunction` call into a `describe` block.
 *
 * @param func Filter function reference
 * @param functionTestData Test data
 */
export function describeAndTestFunction<F extends AnyFunction>(
	func: F,
	functionTestData: FunctionTestData<F>[]
): void {
	describe(getFunctionName(func), () => {
		testFunction(func, functionTestData);
	});
}

/**
 * Test a filter function.
 *
 * This function receives a test data. The test data is an array containing
 * test cases for the given filter. Each item of the array should implement
 * TestFunctionData interface.
 *
 * @param func Filter function reference
 * @param functionTestData Test data
 */
export function testFunction<F extends AnyFunction>(
	func: F,
	functionTestData: FunctionTestData<F>[]
): void {
	for (const data of functionTestData) {
		const { description, funcParameters, expectedValue } = data;

		it(description, () => {
			// funcParameters is not iterable, so we cast to iterable
			expect(func(...(funcParameters as unknown[]))).to.be.deep.equal(
				expectedValue
			);
		});
	}
}
