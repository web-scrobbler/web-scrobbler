'use strict';

const trackArtSelector = '.nowPlayingBarInfoContainer .nowPlayingImage';

Connector.playerSelector = '.nowPlayingBar';

Connector.artistSelector = '.nowPlayingBarText .textActionButton[data-type="MusicArtist"]';

Connector.trackSelector = '.nowPlayingBarText .textActionButton[data-type="MusicAlbum"]';

Connector.trackArtSelector = trackArtSelector;

Connector.timeInfoSelector = '.nowPlayingBarCenter .nowPlayingBarCurrentTime';

Connector.isPlaying = () => {
	return $('.nowPlayingBarCenter .playPauseButton i').text() === 'pause';
};

Connector.getTrackArt = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	if (trackArtUrl) {
		return trackArtUrl.replace(/height=\d+/, '');
	}

	return null;
};

Connector.getUniqueID = () => {
	const trackArtUrl = Util.extractImageUrlFromSelectors(trackArtSelector);
	if (trackArtUrl) {
		return /Items\/(\w+)/g.exec(trackArtUrl)[1];
	}

	return null;
};

Connector.isStateChangeAllowed = () => {
	// prevents scrobble timer resetting when user changes view while playing a song
	return Connector.getCurrentTime() === 0 || Connector.getCurrentTime() === Connector.getDuration();
};
