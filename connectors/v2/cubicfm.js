'use strict';

/* global Connector */

(function() {
		var playerObserver = new MutationObserver(function() {
		if (document.querySelector('.player')) {
			playerObserver.disconnect();
			var actualObserver = new MutationObserver(Connector.onStateChanged);
			actualObserver.observe(document.querySelector('.player'), {
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
		characterData: false
	});
})();

Connector.artistTrackSelector = '.track-mobile-songtitle';

Connector.currentTimeSelector = '.track-pbar-lefttime';

Connector.isPlaying = function () {
	return $('.player-button-play .fa.fa-pause').is(':visible');
};
