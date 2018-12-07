'use strict';

Connector.playerSelector = 'ytmusic-player-bar';

Connector.getTrackArt = () => {
	let trackArtUrl = $('.ytmusic-player-bar.image').attr('src');
	if (trackArtUrl) {
		return trackArtUrl.substring(0, trackArtUrl.lastIndexOf('='));
	}
	return null;
};
Connector.albumSelector = $('.ytmusic-player-bar .yt-formatted-string.style-scope.yt-simple-endpoint[href*="album/"]');

Connector.artistSelector = 'ytmusic-player-queue-item[selected] .byline';

Connector.trackSelector = 'ytmusic-player-queue-item[selected] .song-title';

Connector.timeInfoSelector = '.ytmusic-player-bar.time-info';

Connector.isPlaying = () => $('.ytmusic-player-bar.play-pause-button').attr('title') === 'Pause';

Connector.isScrobblingAllowed = () => $('.ytmusic-player-bar.advertisement').is(':hidden');

Connector.filter = MetadataFilter.getYoutubeFilter();
