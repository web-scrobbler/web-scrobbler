'use strict';

/**
 * Reactor object is created only once in starter script.
 * It reacts to changes in supplied connector and communicates
 * with background script as necessary.
 */
class Reactor { // eslint-disable-line no-unused-vars
	/**
	 * @constructor
	 * @param {Object} connector Connector object
	 */
	constructor(connector) {
		this.setupChromeListener();
		this.connector = connector;

		// Setup listening for state changes on connector.
		connector.reactorCallback = this.onStateChanged;
	}

	/**
	 * Setup Chrome event Listener.
	 */
	setupChromeListener() {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			this.onRuntimeMessage(message, sender, sendResponse);
		});
	}

	/**
	 * Listener for runtime messages from the background script.
	 *
	 * @param {String} message Custom message
	 * @param {Object} sender Message sender object
	 * @param {Function} sendResponse Callback function
	 */
	onRuntimeMessage(message, sender, sendResponse) {
		switch (message.type) {
			// Background script calls this to see
			// if the script is already injected.
			case 'v2.onPing':
				sendResponse(true);
				break;
			// The controller is created and is ready to receive connector state
			case 'v2.onReady':
				this.connector.onReady();
				break;
		}
	}

	/**
	 * Listen for state changes on connector and determines further actions.
	 * @param {Object} state Connector state
	 */
	onStateChanged(state/* , changedFields*/) {
		// ignore changes in current time - it can be used in future
		// if (changedFields.indexOf('currentTime') > -1 && changedFields.length === 1) {
		// 	return;
		// }

		/**
		 * Send given state to background script. There is only single
		 * message type for V2 connectors. Validation, submission and all
		 * other procedures happen on background.
		 */
		let msg = { type: 'v2.stateChanged', state };
		chrome.runtime.sendMessage(msg);
	}
}
