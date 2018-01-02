'use strict';

Connector.playerSelector = '#player';

Connector.getTrackArt = () => {
	let trackArtUrl = $('#playerBarArt').attr('src');
	if (trackArtUrl) {
		return trackArtUrl.replace('=s90-c-e100', '');
	}

	return null;
};

Connector.artistSelector = '#player-artist';

Connector.getTrack = () => {
	return $('#currently-playing-title').text() ||
		$('#player-song-title').text();
};

Connector.albumSelector = '.player-album';

Connector.currentTimeSelector = '#time_container_current';

Connector.durationSelector = '#time_container_duration';

Connector.isPlaying = () => {
	return $('#player *[data-id="play-pause"]').hasClass('playing');
};

Connector.isScrobblingAllowed = () => {
	return Connector.getArtist() !== 'Subscribe to go ad-free';
};
