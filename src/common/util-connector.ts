import connectors from '@/connectors.json';
import CustomPatterns from '@/background/storage/custom-patterns';

import { isPatternMatched } from '@/background/util/url-match';
import { ConnectorEntry } from '@/common/connector-entry';

/**
 * Find a connector entry matching a given URL. Return null if no connector
 * matched the URL.
 *
 * @param url URL
 *
 * @return Connector entry
 */
export async function getConnectorByUrl(url: string): Promise<ConnectorEntry> {
	const customPatterns = await CustomPatterns.getData();

	for (const connector of connectors) {
		const patterns = [];
		if (connector.matches) {
			patterns.push(...connector.matches);
		}

		if (customPatterns[connector.id]) {
			patterns.push(...customPatterns[connector.id]);
		}

		for (const pattern of patterns) {
			if (isPatternMatched(url, pattern)) {
				return connector;
			}
		}
	}

	return null;
}

/**
 * Get a connector entry by a given connector ID.
 *
 * @param connectorId Connector ID
 *
 * @return Connector entry
 */
export function getConnectorById(connectorId: string): ConnectorEntry {
	for (const connector of connectors) {
		if (connector.id === connectorId) {
			return connector;
		}
	}

	return null;
}

/**
 * Return a sorted array of connector entries.
 *
 * @return Array of connectors
 */
export function getSortedConnectors(): ConnectorEntry[] {
	return [...connectors].sort((a, b) => {
		return a.label.localeCompare(b.label);
	});
}
