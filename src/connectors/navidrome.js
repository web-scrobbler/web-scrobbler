'use strict';

Connector.playerSelector = '.music-player-panel';

Connector.trackSelector = '.songTitle';

Connector.artistSelector = '.songArtist';

Connector.albumSelector = '.songAlbum';

Connector.currentTimeSelector = '.current-time';

Connector.durationSelector = '.duration';

Connector.isPlaying = () => {
	return document.querySelector('.img-rotate-pause') === null;
};

function getAlbumImageFromClass(className, useBackgroundImage) {
	return document.querySelector(className) && (
		useBackgroundImage ? document.querySelector(className).style['background-image'] :
			document.querySelector(className).src);
}

Connector.getTrackArt = () => {
	// desktop view mode
	return getAlbumImageFromClass('.img-content') ||
		// mobile overlay mode
		getAlbumImageFromClass('.cover') ||
		// mobile mini controller mode
		getAlbumImageFromClass('.music-player-controller', true);
};
