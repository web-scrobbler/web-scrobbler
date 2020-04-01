'use strict';

/**
 * Entry point.
 */
function main() {
	const connectorId = getConnectorId();

	if (connectorId) {
		console.log(`Web Scrobbler: Request a connector with ID=${connectorId}`);

		requestConnectorInject(connectorId);
	}
}

function getConnectorId() {
	return null;
}

function requestConnectorInject(connectorId) {
	const type = 'REQUEST_CONNECTOR_INJECT';
	const data = { connectorId };
	chrome.runtime.sendMessage({ type, data });
}

main();
