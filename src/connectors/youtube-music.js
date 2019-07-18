'use strict';

Connector.playerSelector = 'ytmusic-player-bar';

Connector.getTrackArt = () => {
	let trackArtUrl = $('.ytmusic-player-bar.image').attr('src');
	if (trackArtUrl) {
		return trackArtUrl.substring(0, trackArtUrl.lastIndexOf('='));
	}
	return null;
};
Connector.albumSelector = '.ytmusic-player-bar .yt-formatted-string.style-scope.yt-simple-endpoint[href*="browse/MPREb_"]';

Connector.artistSelector = 'ytmusic-player-queue-item[selected] .byline';

Connector.trackSelector = 'ytmusic-player-queue-item[selected] .song-title';

Connector.timeInfoSelector = '.ytmusic-player-bar.time-info';

Connector.isPlaying = () => {
	let playingPath = 'M6 19h4V5H6v14zm8-14v14h4V5h-4z';
	return $('.ytmusic-player-bar.play-pause-button #icon > svg > g > path').attr('d') === playingPath;
};

Connector.isScrobblingAllowed = () => $('.ytmusic-player-bar.advertisement').is(':hidden');

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
