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

Connector.trackSelector = '.player-wrapper .middle>div:nth-child(2) a';

Connector.artistSelector = '.player-wrapper .link.artist-name';

Connector.getDuration = function () {
	var text = $('.time').text();
	return Connector.stringToSeconds(text.substring(1)) || null;
};

Connector.isPlaying = function () {
	var classString = $('.buttons .icon').eq(2).attr('class');
	return /(^|\s)icon-pause(\s|$)/.test(classString);
};
