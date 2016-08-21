'use strict';

/* global Connector */

(function() {
		var playerObserver = new MutationObserver(function() {
		if (document.querySelector('#d-content')) {
			playerObserver.disconnect();
			var actualObserver = new MutationObserver(Connector.onStateChanged);
			actualObserver.observe(document.querySelector('#d-content'), {
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

var isPlayingLiveRadio = function() {
	if ($('#d-secondary-control-left .disabled').size() == 1 && $('#d-secondary-control-right .disabled').size() == 1) {
		return 'true';
	} else {
		return 'false';
	}
};

Connector.getArtist = function() {
	if (isPlayingLiveRadio() === 'true') {
			//Maybe ad or program, so ignore
			return null;
	} else {
		return $('#d-info-text .d-sub-text-1').text();
	}
};

Connector.getTrack = function() {
	if (isPlayingLiveRadio() === 'true') {
			//Maybe ad or program, so ignore
			return null;
	} else {
		return $('#d-info-text .d-main-text').text();
	}
};

Connector.isPlaying = function () {
	return $('#d-primary-control .play').size() === 0;
};
