import connectors from '@/connectors.json';
import { test } from '@/background/util/url-match';

import CustomPatterns from '@/background/storage/custom-patterns';

export async function getConnectorByUrl(url) {
	const customPatterns = await CustomPatterns.getData();
	for (const connector of connectors) {
		const patterns = connector.matches || [];

		if (customPatterns[connector.id]) {
			patterns.push(...customPatterns[connector.id]);
		}

		for (const pattern of patterns) {
			if (test(url, pattern)) {
				return connector;
			}
		}
	}

	return null;
}

export function getConnectorById(connectorId) {
	for (const connector of connectors) {
		if (connector.id === connectorId) {
			return connector;
		}
	}

	return null;
}

/**
 * Return a sorted array of connectors.
 *
 * @return {Array} Array of connectors
 */
export function getSortedConnectors() {
	return connectors.slice(0).sort((a, b) => {
		return a.label.localeCompare(b.label);
	});
}
