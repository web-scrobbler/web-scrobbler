'use strict';

/* global Connector */

(function() {
	var playerObserver = new MutationObserver(function() {
		if (document.getElementById('player-controls')) {
			playerObserver.disconnect();
			var actualObserver = new MutationObserver(Connector.onStateChanged);
			actualObserver.observe(document.querySelector('#player-controls'), {
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


Connector.artistTrackSelector = '.current-track-title > span';

Connector.currentTimeSelector = '#current-progress';

Connector.isPlaying = function() {
	return $('div.controls > i.fa.fa-play').hasClass('fa-pause');
};

Connector.getUniqueID = function() {
	return $('#current-track > div.current-track-title > span').attr('href');
};
