'use strict';
define(['storage'], function (storageContainer) {
	var storage = storageContainer.getNamespace('customPatterns');

	return {
		updatePatterns: function (connector) {
			if (connector.originalMatches) {
				connector.matches = connector.originalMatches;
				delete connector.originalMatches;
			}
			if (storage.has(connector.label)) {
				connector.originalMatches = connector.matches;
				connector.matches = storage.get(connector.label);
			}
		},

		setPatterns: function (connector, patterns) {
			storage.set(connector.label, patterns);

			this.updatePatterns(connector);
		},

		resetPatterns: function (connector) {
			storage.remove(connector.label);

			this.updatePatterns(connector);
		}
	};
});
