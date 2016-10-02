'use strict';

// This script runs in non-isolated environment(vk.com itself)
// for accessing to `window.ap` which sends player events

window.webScrobblerInjected = window.webScrobblerInjected || false;

(function () {
	if (window.webScrobblerInjected) {
		return;
	}
	const sendUpdateEvent = () => {
		window.postMessage({type: 'vk:player:update'}, '*');
	};
	for (let e of ['start', 'progress', 'pause', 'stop']) {
		window.ap.subscribers.push({
			et: e,
			cb: sendUpdateEvent,
		});
	}
	window.webScrobblerInjected = true;
})();
