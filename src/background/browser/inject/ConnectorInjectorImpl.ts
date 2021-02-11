import { InjectResult } from '@/background/browser/inject/InjectResult';

import type { ConnectorInjector } from '@/background/browser/inject/ConnectorInjector';
import type { ConnectorEntry } from '@/common/connector-entry';
import type { TabMessageSender } from '@/communication/TabMessageSender';
import type { Logger } from '@/background/util/Logger';

export type InjectScriptFunction = (
	tabId: number,
	options: InjectScriptPayload
) => Promise<void>;

export interface InjectScriptPayload {
	file: string;
	allFrames: boolean;
}

export class ConnectorInjectorImpl implements ConnectorInjector {
	constructor(
		private injectScript: InjectScriptFunction,
		private sender: TabMessageSender<string>,
		private logger: Logger
	) {}

	/**
	 * Inject a matching connector into a page.
	 *
	 * @param tabId An ID of a tab where the connector will be injected
	 * @param connector Connector entry
	 *
	 * @return InjectResult value
	 */
	async inject(
		tabId: number,
		connector: ConnectorEntry
	): Promise<InjectResult> {
		if (!connector) {
			return InjectResult.NoMatch;
		}

		if (await this.isConnectorInjected(tabId)) {
			return InjectResult.Injected;
		}

		const result = await this.injectConnectorScript(tabId, connector.js, {
			allFrames: connector.allFrames ?? false,
		});
		this.logger.debug(`Tab ${tabId}: Injected '${connector.id}' connector`);

		return result;
	}

	/**
	 * Ping the loaded page and check if there is already injected connector.
	 *
	 * @param tabId Tab ID
	 *
	 * @return Check result
	 */
	private async isConnectorInjected(tabId: number): Promise<boolean> {
		// Ping the content page to see if the script is already in place.
		try {
			await this.sender.sendMessage(tabId, { type: 'REQUEST_PING' });
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Inject content scripts into the page.
	 *
	 * @param tabId Tab ID
	 * @param connectorScript Path to the connector file
	 * @param options Options
	 * @param options.allFrames Allow/disallow injecting the connector into all frames
	 *
	 * @return InjectResult value
	 */
	private async injectConnectorScript(
		tabId: number,
		connectorScript: string,
		{ allFrames = false }
	): Promise<InjectResult> {
		// FIXME prefix everything in connectors.json
		// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript
		const allScripts = [
			...contentScripts,
			`/${connectorScript}`,
			starterScript,
		];

		await this.injectScripts(tabId, allScripts, { allFrames });
		return InjectResult.Matched;
	}

	private async injectScripts(
		tabId: number,
		scripts: ReadonlyArray<string>,
		{ allFrames = false }
	): Promise<void> {
		for (const file of scripts) {
			try {
				await this.injectScript(tabId, { file, allFrames });
			} catch (err) {
				// Firefox throws an error if a content script returns no value,
				// so we should catch it, and continue injecting scripts.
				if (err instanceof Error) {
					this.logger.warn(
						`Unable to inject ${file}: ${err.message} to ${tabId}`
					);
				}
			}
		}
	}
}

const contentScripts = [
	'/vendor/filter.js',
	'/content/util.js',
	'/content/reactor.js',
	'/content/connector.js',
];
const starterScript = 'content/starter.js';
