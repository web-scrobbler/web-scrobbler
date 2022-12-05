'use strict';

const trackArtSelector = [
	// Emby v4.6.7
	'.nowPlayingBarInfoContainer .nowPlayingBarImage',
	'.nowPlayingBarInfoContainer .nowPlayingImage'
];

Connector.playerSelector = '.nowPlayingBar';

Connector.artistSelector = [
	// Emby v4.6.7
	'.nowPlayingBarText .secondaryText',
	'.nowPlayingBarText .nowPlayingBarSecondaryText'
];

Connector.trackSelector = [
	// Emby v4.7.10
	'.nowPlayingBarText div:nth-child(1) button',
	// Jellyfin v10.6.0 and newer
	'.nowPlayingBarText div:nth-child(1) a',
	// Emby or Jellyfin v10.5.0 and older
	'.nowPlayingBarText .textActionButton',
];

Connector.albumSelector = [
	// Emby v4.7.10
	'.videoOsdThirdTitle button[data-type="MusicAlbum"]',
	// Emby v4.6.7
	'.videoOsdTitle button:nth-child(2)'
];

Connector.trackArtSelector = trackArtSelector;

Connector.timeInfoSelector = '.nowPlayingBarCenter .nowPlayingBarCurrentTime';

Connector.isPlaying = () => {
	// Emby or Jellyfin v10.5.0 and older
	const playButtonLabel = Util.getTextFromSelectors(
		'.nowPlayingBarCenter .playPauseButton i'
	);
	if (playButtonLabel) {
		return playButtonLabel === 'pause';
	}
	// Emby v4.7.10
	const playButtonText = Util.getTextFromSelectors(
		'.nowPlayingBarCenter .playPauseButton'
	);
	if (playButtonText) {
		return playButtonText === '\uE034';  // pause button icon
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
