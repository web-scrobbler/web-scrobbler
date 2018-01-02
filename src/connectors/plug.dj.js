'use strict';

Connector.playerSelector = '#now-playing-bar';

Connector.artistTrackSelector = '#now-playing-media .bar-value';

Connector.filter = MetadataFilter.getYoutubeFilter();

Connector.isPlaying = () => {
	let timeLeft = $.trim($('#now-playing-time').text());
	let snoozeControl = $('#playback-controls');
	return '00:00' !== timeLeft && !snoozeControl.hasClass('snoozed');
};
