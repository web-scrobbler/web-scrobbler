'use strict';

/* @ifndef DEBUG
chrome.runtime.onInstalled.addListener((event) => {
	if ('install' !== event.reason) {
		return;
	}

	chrome.tabs.create({
		url: '/ui/startup/startup.html'
	});
});
/* @endif */

/**
 * Background script entry point.
 */
require(['extension', 'util/migrate'], (...modules) => {
	const [Extension, Migrate] = modules;

	Migrate.migrate().then(() => {
		new Extension().start();
	});
});
