'use strict';
define(['storage'], function (storageContainer) {
	var storage = storageContainer.getNamespace('customPatterns');

	return {
		getConnectorPatterns: function (connector) {
			var patterns;
			if (storage.has(connector.label)) {
				patterns = storage.get(connector.label);
			}
			else {
				patterns = connector.matches;
			}

			return patterns;
		},

		setPatterns: function (connector, patterns) {
			storage.set(connector.label, patterns);
		},

		resetPatterns: function (connector) {
			storage.remove(connector.label);
		}
	};
});
