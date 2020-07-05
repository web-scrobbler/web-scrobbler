'use strict';

/**
 * Reactor object is created only once in starter script.
 * It reacts to changes in supplied connector and communicates
 * with background script as necessary.
 */
class Reactor { // eslint-disable-line no-unused-vars
	/**
	 * @constructor
	 *
	 * @param {Object} connector Connector object
	 */
	constructor(connector) {
		this.setupEventListener();
		this.connector = connector;

		// Setup listening for state changes on connector.
		connector.reactorCallback = this.onStateChanged.bind(this);
	}

	/**
	 * Setup event listener.
	 */
	setupEventListener() {
		chrome.runtime.onMessage.addListener(this.onRuntimeMessage.bind(this));

		this.port = chrome.runtime.connect({ name: 'content-script' });
		this.port.onDisconnect.addListener(() => {
			Util.debugLog('Port is closed', 'warn');
			this.connector.reactorCallback = null;
		});
	}

	/**
	 * Listener for runtime messages from the background script.
	 *
	 * @param {String} message Custom message
	 */
	onRuntimeMessage(message) {
		switch (message.type) {
			/*
			 * Background script calls this to see
			 * if the script is already injected.
			 */
			case 'REQUEST_PING':
				return true;

			// The controller is created and is ready to receive connector state
			case 'EVENT_READY':
				this.connector.onReady();
				break;
		}
	}

	/**
	 * Listen for state changes on connector and determines further actions.
	 *
	 * @param {Object} state Connector state
	 */
	onStateChanged(state) {
		/**
		 * Send given state to background script. There is only single
		 * message type for V2 connectors. Validation, submission and all
		 * other procedures happen on background.
		 */
		this.port.postMessage({ type: 'EVENT_STATE_CHANGED', data: state });
	}
}
