'use strict';

$(() => {
	$('#reauth').click(() => {
		console.log(222);
		let url = chrome.extension.getURL('/options/options.html#reauth');
		chrome.tabs.create({ url });
	});
});
