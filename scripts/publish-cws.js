#!/usr/bin/env node

'use strict';

/**
 * Utility script to publish an extension to the Chrome Web Store.
 * Usage:
 *   publish-cws.js path/to/package.zip
 *
 * Requirements:
 *  - 'webstore-upload' package.
 *
 * Script preferences are placed into 'publish-cws.json' file.
 */

const webstoreUpload = require('webstore-upload');
const options = require('./publish-cws.json');

const EXTENSION_ID = 'hhinaapppaileiechjoiifaancjggfjm';

/**
 * Get option value from JSON configuration file.
 * @param  {String} key Option key
 * @param  {Boolean} optional Flag means option is not required
 * @return {String} Option value
 * @throws {Error} if option is not defined
 */
function getOption(key, optional = false) {
	let value = options[key];
	if (typeof value !== 'string' || value === '') {
		if (optional) {
			return undefined;
		}
		throw new Error(`Required '${key}' option is not set`);
	}
	return value;
}

/**
 * Upload extension to Chrome Web Store.
 * @param  {String} packagePath Path to package
 * @return {Promise} Promise that will be resolved when the task has complete
 */
function uploadExtension(packagePath) {
	const uploadOptions = {
		accounts: {
			default: {
				publish: true,
				client_id: getOption('clientId'),
				client_secret: getOption('clientSecret'),
				refresh_token: getOption('refreshToken', true),
			}
		},
		extensions: {
			'web-scrobbler': {
				appID: EXTENSION_ID,
				zip: packagePath
			},
		},
		uploadExtensions: ['web-scrobbler']
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
		throw new Error('Package path is not specified');
	}
}

main(process.argv.slice(2));
