import type { InjectResult } from '@/background/browser/inject/InjectResult';
import type { ConnectorEntry } from '@/common/connector-entry';

export interface ConnectorInjector {
	/**
	 * Inject a matching connector into a page.
	 *
	 * @param tabId An ID of a tab where the connector will be injected
	 * @param connector Connector entry
	 *
	 * @return InjectResult value
	 */
	inject(tabId: number, connector: ConnectorEntry): Promise<InjectResult>;
}
