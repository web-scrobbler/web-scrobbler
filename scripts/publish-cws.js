#!/usr/bin/env node

'use strict';

/**
 * Utility script to publish a Google Chrome extension to the Chrome Web Store.
 * Usage:
 *   publish-cws.js path/to/package.zip
 */

const webstoreUpload = require('webstore-upload');
const options = require('./publish-cws.json');

function getOption(key) {
	let value = options[key];
	if (typeof value !== 'string' || value === '') {
		throw new Error(`Required '${key}' option is not set`);
	}
	return value;
}

function uploadExtension(packagePath) {
	const uploadOptions = {
		accounts: {
			default: {
				publish: true,
				client_id: getOption('clientId'),
				client_secret: getOption('clientSecret')
			}
		},
		extensions: {
			extension1: {
				appID: getOption('appId'),
				zip: packagePath
			},
		},
		uploadExtensions: ['extension1']
	};

	return webstoreUpload(uploadOptions, 'default');
}

function setupErrorHandler() {
	process.on('uncaughtException', (err) => {
		console.log(`Error: ${err.message}`);
	});
}

function main(argv) {
	setupErrorHandler();

	let packagePath = argv[0];
	if (packagePath) {
		uploadExtension(packagePath);
	} else {
		throw new Error(`Package path is not specified`);
	}
}

main(process.argv.slice(2));
