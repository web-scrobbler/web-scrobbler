'use strict';

$(() => {
	$('#reauth').click(() => {
		let url = chrome.extension.getURL('/options/options.html#accounts');
		chrome.tabs.create({ url });
	});
});
