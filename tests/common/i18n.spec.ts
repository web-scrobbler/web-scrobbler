import { L } from '@/common/i18n';

import { expect } from 'chai';

describe('i18n', () => {
	it('should return translated string', () => {
		expect(L('availableStringId')).to.be.equal('Translated string');
	});

	it('should return stringId for missing string', () => {
		expect(L('missingStringId')).to.be.equal('missingStringId');
	});

	it('should return translated string', () => {
		expect(L`availableStringId`).to.be.equal('Translated string');
	});

	it('should return stringId for missing string', () => {
		expect(L`missingStringId`).to.be.equal('missingStringId');
	});
});
