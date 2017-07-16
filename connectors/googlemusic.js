'use strict';

Connector.playerSelector = '#player';

Connector.getTrackArt = function() {
	let trackArtUrl = $('#playerBarArt').attr('src');
	if (trackArtUrl) {
		return trackArtUrl.replace('=s90-c-e100', '');
	}
};

Connector.artistSelector = '#player-artist';

Connector.getTrack = function() {
	return $('#currently-playing-title').text() ||
		$('#player-song-title').text();
};

Connector.albumSelector = '.player-album';

Connector.currentTimeSelector = '#time_container_current';

Connector.durationSelector = '#time_container_duration';

Connector.isPlaying = function() {
	return $('#player *[data-id="play-pause"]').hasClass('playing');
};

Connector.isScrobblingAllowed = function() {
	return Connector.getArtist() !== 'Subscribe to go ad-free';
};
