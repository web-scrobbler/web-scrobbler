import connectors from '@/connectors.json';

import { ConnectorEntry } from '@/common/connector-entry';

import { isPatternMatched } from '@/background/util/url-match';
import { getCustomUrlPatterns } from '@/background/repository/GetCustomUrlPatterns';

/**
 * Find a connector entry matching a given URL. Return null if no connector
 * matched the URL.
 *
 * @param url URL
 *
 * @return Connector entry
 */
export async function getConnectorByUrl(url: string): Promise<ConnectorEntry> {
	const customUrlPatterns = getCustomUrlPatterns();

	for (const connector of connectors) {
		const patterns = [];
		if (connector.matches) {
			patterns.push(...connector.matches);
		}

		patterns.push(...(await customUrlPatterns.getPatterns(connector.id)));

		for (const pattern of patterns) {
			if (isPatternMatched(url, pattern)) {
				return connector;
			}
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
