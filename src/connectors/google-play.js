'use strict';

const trackArtSelector = '#playerBarArt';
const infoSelector = '#player .now-playing-actions';

Connector.useMediaSessionApi();

Connector.playerSelector = '#player';

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	if (trackArtUrl) {
		return trackArtUrl.replace('=s90-c-e100', '');
	}

	return null;
};

Connector.artistSelector = '#player-artist';

Connector.trackSelector = '#currently-playing-title';

Connector.albumSelector = '.player-album';

Connector.currentTimeSelector = '#time_container_current';

Connector.durationSelector = '#time_container_duration';

Connector.pauseButtonSelector = '#player-bar-play-pause.playing';

Connector.isPodcast = () => Util.hasElementClass(infoSelector, 'podcast');

Connector.isScrobblingAllowed = () => Connector.getArtist() !== 'Subscribe to go ad-free';
