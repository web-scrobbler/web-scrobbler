'use strict';

const trackArtSelector = '.nowPlayingBarInfoContainer .nowPlayingImage';

Connector.playerSelector = '.nowPlayingBar';

Connector.artistSelector = '.nowPlayingBarText .nowPlayingBarSecondaryText';

Connector.trackSelector = '.nowPlayingBarText .textActionButton';

Connector.trackArtSelector = trackArtSelector;

Connector.timeInfoSelector = '.nowPlayingBarCenter .nowPlayingBarCurrentTime';

Connector.isPlaying = () => {
	const buttonText = Util.getTextFromSelectors('.nowPlayingBarCenter .playPauseButton i');
	return buttonText === 'pause';
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
