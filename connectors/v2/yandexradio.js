'use strict';

/* global Connector */

Connector.trackArtImageSelector = '.slider__items > div:nth-child(3) .track__cover';
Connector.trackSelector = '.slider__items > div:nth-child(3) .track__title';
Connector.artistSelector = '.slider__items > div:nth-child(3) .track__artists';

Connector.isPlaying = function() {
	return $('body').hasClass('body_state_playing');
};

(function() {
	var actualObserver;
	var playerObserver = new MutationObserver(function() {
		var playerSelector = document.querySelector('.page-station__bar');
		if (playerSelector !== null) {
			if (!actualObserver) {
				actualObserver = new MutationObserver(Connector.onStateChanged);
				actualObserver.observe(playerSelector, {
					subtree: true,
					childList: true,
					attributes: true,
					characterData: true
				});
			}
		} else {
			if (actualObserver) {
				actualObserver.disconnect();
				actualObserver = null;
			}
		}
	});

	playerObserver.observe(document.body, {
		subtree: true,
		childList: true,
		attributes: false,
		characterData: false
	});
})();
