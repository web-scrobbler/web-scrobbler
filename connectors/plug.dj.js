'use strict';

/* global Connector, MetadataFilter */

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

Connector.filter = MetadataFilter.getYoutubeFilter();

Connector.isPlaying = function () {
	var timeLeft = $.trim($('#now-playing-time').text());
	var snoozeControl = $('#playback-controls');
	return '00:00' !== timeLeft && !snoozeControl.hasClass('snoozed');
};
