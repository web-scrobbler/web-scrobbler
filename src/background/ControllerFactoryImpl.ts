import { Controller } from '@/background/object/controller';

import type { ControllerFactory } from '@/background/ControllerFactory';
import type { ScrobblerManager } from '@/background/scrobbler/ScrobblerManager';
import type { ConnectorEntry } from '@/common/connector-entry';

export class ControllerFactoryImpl implements ControllerFactory {
	constructor(private scrobblerManager: ScrobblerManager) {}

	createController(
		tabId: number,
		connector: ConnectorEntry,
		isEnabled: boolean
	): Controller {
		return new Controller(
			tabId,
			connector,
			isEnabled,
			this.scrobblerManager
		);
	}
}
