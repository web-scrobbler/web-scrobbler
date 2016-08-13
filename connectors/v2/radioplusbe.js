'use strict';

/* global Connector */

Connector.playerSelector = '.audio-controller';

Connector.artistSelector = '.info .artist';

Connector.trackSelector = '.info .song';

Connector.isPlaying = function () {
	return $('.audio-controller .any-surfer').text() === 'Stop de radiospeler';
};

(function() {
	var playerObserver = new MutationObserver(function() {
		var playerElement = document.querySelector('.audio-controller');
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
