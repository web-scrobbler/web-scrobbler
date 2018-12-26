'use strict';

chrome.runtime.onInstalled.addListener((event) => {
	if ('install' !== event.reason) {
		return;
	}

	chrome.tabs.create({
		url: '/startup/startup.html'
	});
});
