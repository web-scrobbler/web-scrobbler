import BaseConnector from '@/core/content/connector';
import { State } from '@/core/types';
import Controller from '@/core/object/controller/controller';

/**
 * Reactor object reacts to changes in supplied connector
 * and communicates with background script as necessary.
 */
export default class Reactor {
	/**
	 * Controller object of current tab
	 */
	private controller: Controller;

	/**
	 * @param connector - Connector object
	 * @param isEnabled - Whether the connector is currently enabled
	 */
	constructor(connector: BaseConnector, isEnabled: boolean) {
		this.controller = new Controller(connector.meta, isEnabled);

		// Setup listening for state changes on connector.
		connector.controllerCallback = this.onStateChanged.bind(this);
	}

	/**
	 * Listen for state changes on connector and determines further actions.
	 * @param state - Connector state
	 */
	private onStateChanged(state: State) {
		this.controller.onStateChanged(state);
	}
}
