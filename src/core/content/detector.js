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

const metaPropertiesRules = {
	bandcamp({ name, content }) {
		return name === 'generator' && content === 'Bandcamp';
	},

	funkwhale({ content, name, property }) {
		if (name === 'generator') {
			return content === 'Funkwhale';
		}

		/*
		 * Old versions have no `meta[generator=Funkwhale]` property.
		 * TODO: Remove this check
		 */
		return property === 'og:site_name' &&
			content && content.toLowerCase().includes('funkwhale');
	},
};

function getConnectorId() {
	const props = getMetaProperties();

	for (const connectorId in metaPropertiesRules) {
		const checkFn = metaPropertiesRules[connectorId];

		for (const prop of props) {
			if (checkFn(prop)) {
				return connectorId;
			}
		}
	}

	return null;
}

function requestConnectorInject(connectorId) {
	const type = 'REQUEST_CONNECTOR_INJECT';
	const data = { connectorId };
	chrome.runtime.sendMessage({ type, data });
}

function getMetaProperties() {
	const metaNodes = document.head.querySelectorAll('meta');
	const properties = [];

	for (const node of metaNodes) {
		const property = node.getAttribute('property');
		const content = node.getAttribute('content');
		const name = node.getAttribute('name');

		properties.push({ name, content, property });
	}

	return properties;
}

main();
