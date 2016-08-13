'use strict';

/* global Connector */

Connector.trackSelector = '.player-controls__title';
Connector.artistSelector = '.player-controls__artists';

Connector.isPlaying = function() {
	return $('body').hasClass('body_state_playing');
};

Connector.getTrackArt = function() {
	var backgroundStyle = $('.slider__item_playing .track__cover').css('background-image');
	var backgroundUrl = /^url\((['"]?)(.*)\1\)$/.exec(backgroundStyle);
	return backgroundUrl ? backgroundUrl[2] : null;

};

(function() {
	var actualObserver;
	var playerObserver = new MutationObserver(function() {
		var playerSelector = document.querySelector('.page-station');
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
