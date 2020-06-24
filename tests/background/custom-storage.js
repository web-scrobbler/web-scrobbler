'use strict';

const chai = require('chai');
const expect = chai.expect;

const CustomStorage = require('../../src/core/background/storage/custom-storage');

const { makeStorageWrapperStub } = require('../helpers');

class CustomStorageImpl extends CustomStorage {
	getStorage() {
		return makeStorageWrapperStub();
	}
}

function testNotImplementedMethods() {
	it('should throw an error in CustomStorage constructor', () => {
		return expect(() => {
			new CustomStorage();
		}).to.throw();
	});
}

function testMethods() {
	const customStorage = new CustomStorageImpl();

	it('should return Promise in `getData` method', () => {
		expect(customStorage.getData()).instanceof(Promise);
	});

	it('should return Promise in `saveData` method', () => {
		expect(customStorage.saveData({})).instanceof(Promise);
	});

	it('should return Promise in `updateData` method', () => {
		expect(customStorage.updateData({})).instanceof(Promise);
	});

	it('should return Promise in `clear` method', () => {
		expect(customStorage.clear()).instanceof(Promise);
	});
}

function runTests() {
	describe(
		'should throw an error for not implemented methods',
		testNotImplementedMethods
	);

	describe(
		'should have valid base methods',
		testMethods
	);
}

runTests();
