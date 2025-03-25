import type { ConnectorMeta } from '@/core/connectors';
import connectors from '@/core/connectors';
import { test } from '@/util/url-match';

import { getAllPatterns } from '@/core/storage/custom-patterns';
import { sendBackgroundMessage } from './communication';
import { connectorRules } from '@/core/connectors-dynamic';

/**
 * Calls getConnector from background script.
 * @param tabId - tab ID of content script to get connector for.
 * @returns connector corresponding to the tab provided.
 */
export async function getConnectorFromBackgroundScript(
	tabId: number,
): Promise<ConnectorMeta | null> {
	return sendBackgroundMessage(tabId, {
		type: 'getConnector',
		payload: undefined,
	});
}

/**
 * Check for a connector that fits the current page.
 * Only usable from content script.
 *
 * @returns connector to be used on current page.
 */
export async function getConnectorFromContentScript(): Promise<ConnectorMeta | null> {
	const connector = await getConnectorByUrl(window.location.href);
	if (connector) {
		return connector;
	}
	const connectorFromDom = getConnectorFromDom();
	if (connectorFromDom) {
		return connectorFromDom;
	}
	return null;
}

/**
 * Get the connector corresponding to DOM content, if there is one.
 * Only usable from content script.
 * @returns connector corresponding to current DOM content
 */
export function getConnectorFromDom(): ConnectorMeta | null {
	for (const [id, rule] of Object.entries(connectorRules)) {
		if (rule()) {
			return getConnectorById(id);
		}
	}
	return null;
}

/**
 * Get the connector corresponding to a url, if there is one
 * @param url - url to search for connector for
 * @returns connector corresponding to url
 */
export async function getConnectorByUrl(
	url: string,
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
