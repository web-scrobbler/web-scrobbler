import connectors, { ConnectorMeta } from '@/core/connectors';
import { test } from '@/util/url-match';

import { getAllPatterns } from '@/core/storage/custom-patterns';

/**
 * Get the connector corresponding to a url, if there is one
 * @param url - url to search for connector for
 * @returns connector corresponding to url
 */
export async function getConnectorByUrl(
	url: string
): Promise<ConnectorMeta | null> {
	const customPatterns = (await getAllPatterns()) || {};
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

/**
 * Get the connector corresponding to a connector id, if there is one
 * @param connectorId - id to search for connector for
 * @returns connector corresponding to id
 */
export function getConnectorById(connectorId: string): ConnectorMeta | null {
	for (const connector of connectors) {
		if (connector.id === connectorId) {
			return connector;
		}
	}

	return null;
}

/**
 * Return a sorted array of connectors.
 * @returns Array of connectors
 */
export function getSortedConnectors(): ConnectorMeta[] {
	return connectors.slice(0).sort((a, b) => {
		return a.label.localeCompare(b.label);
	});
}
