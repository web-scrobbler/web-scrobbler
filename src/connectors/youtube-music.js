'use strict';

const playButtonSelector = '.ytmusic-player-bar.play-pause-button #icon > svg > g > path';
const trackArtSelector = '.ytmusic-player-bar.image';
const trackSelector = 'ytmusic-player-queue-item[selected] .song-title';
const adSelector = '.ytmusic-player-bar.advertisement';

const playingPath = 'M6 19h4V5H6v14zm8-14v14h4V5h-4z';

Connector.playerSelector = 'ytmusic-player-bar';

Connector.artistSelector = 'ytmusic-player-queue-item[selected] .byline';

Connector.trackSelector = trackSelector;

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	if (trackArtUrl) {
		return trackArtUrl.substring(0, trackArtUrl.lastIndexOf('='));
	}
	return null;
};

Connector.albumSelector = '.ytmusic-player-bar .yt-formatted-string.style-scope.yt-simple-endpoint[href*="browse/MPREb_"]';

Connector.timeInfoSelector = '.ytmusic-player-bar.time-info';

Connector.isPlaying = () => {
	return Util.getAttrFromSelectors(playButtonSelector, 'd') === playingPath;
};

Connector.isScrobblingAllowed = () => !Util.isElementVisible(adSelector);

Connector.applyFilter(MetadataFilter.getYoutubeFilter());
