import { timeoutPromise } from '@/background/util/util';

const testTimeout = 5;

describe('timeoutPromise', () => {
	it('should throw an error if promise is not resolved earlier', async () => {
		const slowPromise = new Promise((resolve) => {
			setTimeout(resolve, testTimeout * 2);
		});
		try {
			await timeoutPromise(testTimeout, slowPromise);
		} catch (err) {
			/* Do nothing, it's expected */
			return;
		}

		throw new Error('The promise should be failed');
	});

	it('should not throw an error if promise is resolved earlier', async () => {
		await timeoutPromise(testTimeout, Promise.resolve());
	});

	it('should not throw an error if promise is rejected earlier', async () => {
		const testErr = new Error('Test');
		try {
			await timeoutPromise(testTimeout, Promise.reject(testErr));
		} catch (err) {
			if (err !== testErr) {
				throw err;
			}
		}
	});
});
