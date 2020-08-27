'use strict';

const trackArtSelector = '.nowPlayingBarInfoContainer .nowPlayingImage';

Connector.playerSelector = '.nowPlayingBar';

Connector.artistSelector = '.nowPlayingBarText .nowPlayingBarSecondaryText';

Connector.trackSelector = [
	// Jellyfin v10.6.0 and newer
	'.nowPlayingBarText div:nth-child(1) a',
	// Emby or Jellyfin v10.5.0 and older
	'.nowPlayingBarText .textActionButton',
];

Connector.trackArtSelector = trackArtSelector;

Connector.timeInfoSelector = '.nowPlayingBarCenter .nowPlayingBarCurrentTime';

Connector.isPlaying = () => {
	const playButtonLabel = Util.getTextFromSelectors(
		'.nowPlayingBarCenter .playPauseButton i'
	);
	// Emby or Jellyfin v10.5.0 and older
	if (playButtonLabel) {
		return playButtonLabel === 'pause';
	}

	// Jellyfin v10.6.0 and newer
	return document.querySelector('.playPauseButton .play_arrow') === null;
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
	return (
		Connector.getCurrentTime() === 0 ||
		Connector.getCurrentTime() === Connector.getDuration()
	);
};
