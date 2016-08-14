'use strict';

/* global Connector */

Connector.artistSelector = '.track-title .artist';

Connector.trackSelector = '.track-title .title';

Connector.isPlaying = function () {
	console.log($('.playback-button > div').attr('title'));
	return $('.playback-button > div').attr('title') == 'Pause Track';
};

(function() {
	var playerObserver = new MutationObserver(function() {
		var playerElement = document.querySelector('#player-container');
		if (playerElement !== null) {
			playerObserver.disconnect();
			var actualObserver = new MutationObserver(Connector.onStateChanged);
			actualObserver.observe(playerElement, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true
			});
		}
	});

	playerObserver.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: false,
		characterData: false,
	});

})();
