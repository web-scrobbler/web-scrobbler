'use strict';

$(() => {
	$('#reauth').click(() => {
		// FIXME: Replace to `chrome.runtime.getURL`.
		let url = chrome.extension.getURL('/options/options.html#accounts');
		chrome.tabs.create({ url });
	});
});
