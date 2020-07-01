'use strict';

define((require) => {
	const connectors = require('connectors');
	const UrlMatch = require('util/url-match');

	const CustomPatterns = require('storage/custom-patterns');

	async function getConnectorByUrl(url) {
		const customPatterns = await CustomPatterns.getData();
		for (const connector of connectors) {
			const patterns = connector.matches || [];

			if (customPatterns[connector.id]) {
				patterns.push(...customPatterns[connector.id]);
			}

			for (const pattern of patterns) {
				if (UrlMatch.test(url, pattern)) {
					return connector;
				}
			}
		}

		return null;
	}

	function getConnectorById(connectorId) {
		for (const connector of connectors) {
			if (connector.id === connectorId) {
				return connector;
			}
		}

		return null;
	}

	/**
	 * Return a sorted array of connectors.
	 * @return {Array} Array of connectors
	 */
	function getSortedConnectors() {
		return connectors.slice(0).sort((a, b) => {
			return a.label.localeCompare(b.label);
		});
	}

	return {
		getConnectorById,
		getConnectorByUrl,
		getSortedConnectors,
	};
});
