'use strict';

define(['storage/chromeStorage'], (ChromeStorage) => {
	const storage = ChromeStorage.getLocalStorage('customPatterns');

	return {
		getAllPatterns() {
			return storage.get();
		},

		setPatterns(connector, patterns) {
			return storage.get().then((data) => {
				data[connector] = patterns;
				return storage.set(data);
			});
		},

		resetPatterns(connector) {
			return storage.get().then((data) => {
				delete data[connector];
				return storage.set(data);
			});
		}
	};
});
