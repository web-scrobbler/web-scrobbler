import type { Controller } from '@/background/object/controller';
import type { ConnectorEntry } from '@/common/connector-entry';

// TODO remove flag

export interface ControllerFactory {
	/**
	 * Create a new Controller object.
	 *
	 * @param tabId ID of the tab to which the controller is attached
	 * @param connector Connector entry
	 * @param isEnabled Flag
	 *
	 * @return Controller object
	 */
	createController(
		tabId: number,
		connector: ConnectorEntry,
		isEnabled: boolean
	): Controller;
}
