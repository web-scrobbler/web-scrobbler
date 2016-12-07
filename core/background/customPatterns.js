'use strict';
define(['chromeStorage'], function (ChromeStorage) {
	var storage = ChromeStorage.getNamespace('customPatterns');

	return {
		getAllPatterns: function(cb) {
			storage.get(cb);
		},

		setPatterns: function (connector, patterns) {
			storage.get(function(data) {
				data[connector] = patterns;
				storage.set(data);
			});
		},

		resetPatterns: function (connector) {
			storage.get(function(data) {
				delete data[connector];
				storage.set(data);
			});
		}
	};
});
