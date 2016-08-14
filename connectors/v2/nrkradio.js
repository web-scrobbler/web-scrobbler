'use strict';

/* global Connector */

Connector.getArtistTrack = function () {
	var text = $('.active.music .fnn-title').text();
	var separator = this.findSeparator(text);

	var artist = null;
	var track = null;

	if (separator !== null) {
		artist = text.substr(0, separator.index).trim();
		track = text.substr(separator.index + separator.length).trim();
	}

	return {artist: artist, track: track};
};

Connector.isPlaying = function () {
	return true;
};

(function() {
	var playerObserver = new MutationObserver(function() {
		var playerElement = document.querySelector('.pi-infobox');
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
