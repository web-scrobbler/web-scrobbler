'use strict';

/* global Connector, YoutubeFilter */

(function () {
	var appContainer = document.querySelector('#app');
	var appContainerObserver = new MutationObserver(function () {
		var playbackContainer = document.querySelector('#now-playing-bar');
		if (playbackContainer) {
			appContainerObserver.disconnect();
			var playbackContainerObserver = new MutationObserver(Connector.onStateChanged);
			playbackContainerObserver.observe(playbackContainer, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true
			});
			$('#playback-controls .snooze').on('click', function () {
				console.log('state change');
				Connector.onStateChanged();
			});
			$('#playback-controls .refresh').on('click', function () {
				console.log('state change');
				Connector.onStateChanged();
			});
		}
	});
	appContainerObserver.observe(appContainer, {
		childList: true,
		subtree: true,
		attributes: false,
		characterData: false
	});
})();

Connector.artistTrackSelector = '#now-playing-media .bar-value';

Connector.getArtistTrack = function () {
	var text = $(Connector.artistTrackSelector).text();

	var separator = Connector.findSeparator(text);

	if (separator === null || text.length === 0) {
		return {artist: null, track: null};
	}

	var artist =  text.substr(0, separator.index);
	var track = text.substr(separator.index + separator.length);

	return {artist: artist, track: track};
};

Connector.filter = YoutubeFilter;

Connector.isPlaying = function () {
	var timeLeft = $.trim($('#now-playing-time').text());
	var snoozeControl = $('#playback-controls');
	return '00:00' !== timeLeft && !snoozeControl.hasClass('snoozed');
};
