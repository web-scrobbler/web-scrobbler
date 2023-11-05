/**
 * The module manages URL patterns can be defined by users.
 */
import { getStorage, CUSTOM_PATTERNS } from '@/core/storage/browser-storage';
import { CustomPatterns } from './wrapper';

const storage = getStorage(CUSTOM_PATTERNS);

/**
 * Get custom patterns for all connectors.
 * @returns Custom URL patterns
 */
export function getAllPatterns(): Promise<CustomPatterns | null> {
	return storage.get();
}

/**
 * Update custom patterns and save them to storage.
 * @param connectorId - Connector ID
 * @param patterns - Array of custom URL patterns
 */
export async function setPatterns(
	connectorId: string,
	patterns: string[],
): Promise<void> {
	const data = (await storage.get()) ?? {};
	data[connectorId] = patterns;
	await storage.set(data);
}

/**
 * Remove custom URL patterns for given connector.
 * @param connectorId - Connector ID
 */
export async function resetPatterns(connectorId: string): Promise<void> {
	const data = (await storage.get()) ?? {};
	delete data[connectorId];
	await storage.set(data);
}
