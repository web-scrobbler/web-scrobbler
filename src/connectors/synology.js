'use strict';

Connector.playerSelector = '.syno-as-control';

Connector.trackSelector = '.info-title';

Connector.getTrackInfo = () => {
	const albumArtistText = document.querySelector('.info-album-artist').textContent;
	return Util.splitArtistAlbum(albumArtistText, null, { swap: true });
};

Connector.currentTimeSelector = '.info-position';

Connector.durationSelector = '.info-duration';

Connector.trackArtSelector = '.player-info-thumb';

Connector.isPlaying = () => {
	const playBtn = document.querySelector('.player-play > span');

	if (!playBtn) {
		return false;

	}
	return playBtn.classList.contains('player-btn-pause');
};
