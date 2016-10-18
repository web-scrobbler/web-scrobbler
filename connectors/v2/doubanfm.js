'use strict';

/* global Connector */

(function() {
		var playerObserver = new MutationObserver(function() {
		if (document.querySelector('.player-wrapper')) {
			playerObserver.disconnect();
			var actualObserver = new MutationObserver(Connector.onStateChanged);
			actualObserver.observe(document.querySelector('.player-wrapper'), {
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

Connector.trackArtImageSelector = '.playing-cover img';

Connector.getTrack = function() {
	return $('.player-wrapper .middle>div:nth-child(2) a').first().text();
};

Connector.getArtist = function() {
	return $('.player-wrapper .link.artist-name').first().text();
};

Connector.getDuration = function () {
	var text = $('.time').text();
	return Connector.stringToSeconds(text.substring(1)) || null;
};

Connector.isPlaying = function () {
	return $('.player-wrapper .buttons .icon-pause').length > 0;
};
