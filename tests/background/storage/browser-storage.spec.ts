import { expect } from 'chai';

import BrowserStorage from '@/background/storage/browser-storage';
import { getTestName } from '#/helpers/util';

describe(getTestName(__filename), () => {
	it('should return local storage', () => {
		const storage = BrowserStorage.getScrobblerStorage('LastFM');
		expect(storage).to.be.an('object');
	});

	it('should return local storage', () => {
		const storage = BrowserStorage.getStorage(BrowserStorage.CORE);
		expect(storage).to.be.an('object');
	});

	it('should return sync storage', () => {
		const storage = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
		expect(storage).to.be.an('object');
	});

	it('should throw error for unknown storage', () => {
		expect(() => {
			return BrowserStorage.getStorage('unknown-storage123');
		}).to.throw();
	});
});
