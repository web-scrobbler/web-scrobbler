'use strict';
/* exported Reactor */

/**
 * Reactor object is created only once in starter script.
 * It reacts to changes in supplied connector and communicates with background script as necessary
 *
 * @constructor
 */
var Reactor = function(connector) {

	/**
	 * Listener for runtime messages from the background script
	 *
	 * @param message custom message
	 * @param sender {MessageSender}
	 * @param sendResponse {function}
	 */
	var runtimeMessageListener = function(message, sender, sendResponse) {
		switch(message.type) {
			// background calls this to see if the script is already injected
			case 'ping':
				sendResponse(true);
				break;
		}
	};

	// setup the listener immediately
	chrome.runtime.onMessage.addListener(runtimeMessageListener);



	/**
	 * Listens for state changes on connector and determines further actions
	 *
	 * @param newState
	 * @param changedFields
	 */
	/* jshint unused: false */
	this.onStateChanged = function(newState, changedFields) {
		// ignore changes in current time - it can be used in future
		//if (changedFields.indexOf('currentTime') > -1 && changedFields.length === 1) {
		//	return;
		//}

		// distribute all other changes to background script to do all the hard work
		this.sendStateToBackground(newState);
	}.bind(this);

	// setup listening for state changes on connector
	connector.reactorCallback = this.onStateChanged;



	/**
	 * Sends given state to background script. There is only single message type
	 * for V2 connectors. Validation, submission and all other procedures happen on background.
	 *
	 * @param state
	 */
	this.sendStateToBackground = function(state) {
		var msg = {
			type: 'v2.stateChanged',
			state: state
		};

		chrome.runtime.sendMessage(msg);
	};

};
