'use strict';

Connector.playerSelector = 'ytmusic-player-bar';

Connector.getTrackArt = () => {
	let trackArtUrl = $('.ytmusic-player-bar.image').attr('src');
	if (trackArtUrl) {
		return trackArtUrl.substring(0, trackArtUrl.lastIndexOf('='));
	}
	return null;
};

Connector.artistSelector = 'ytmusic-player-queue-item[selected] .byline';

Connector.trackSelector = 'ytmusic-player-queue-item[selected] .song-title';

Connector.timeInfoSelector = '.ytmusic-player-bar.time-info';

Connector.isPlaying = () => $('.ytmusic-player-bar.play-pause-button').attr('title') === 'Pause';

Connector.isScrobblingAllowed = () => $('.ytmusic-player-bar.advertisement').is(':hidden');
