'use strict';

define(['chromeStorage'], function (ChromeStorage) {
	const storage = ChromeStorage.getNamespace('customPatterns');

	return {
		getAllPatterns() {
			return new Promise((resolve) => {
				storage.get(resolve);
			});
		},

		setPatterns(connector, patterns) {
			return new Promise((resolve) => {
				storage.get((data) => {
					data[connector] = patterns;
					storage.set(data, resolve);
				});
			});
		},

		resetPatterns(connector) {
			return new Promise((resolve) => {
				storage.get(function(data) {
					delete data[connector];
					storage.set(data, resolve);
				});
			});
		}
	};
});
