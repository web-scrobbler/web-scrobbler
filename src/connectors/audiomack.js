'use strict';

const albumSelector = '.player__album-text > a';
const trackSelector = '.player .player__title';
const albumLabelSelector = '.player__album-text';
const featArtistSelector = '.player .player__featuring';

Connector.artistSelector = '.player .player__artist';

Connector.getAlbum = () => {
	if (isAlbum()) {
		return Util.getTextFromSelectors(albumSelector);
	}

	return null;
};

Connector.getTrack = () => {
	const track = Util.getTextFromSelectors(trackSelector);
	const featArtist = Util.getTextFromSelectors(featArtistSelector);

	if (featArtist) {
		return `${track} (${featArtist})`;
	}

	return track;
};

Connector.playerSelector = '.player';

Connector.pauseButtonSelector = '.play-button--playing';

Connector.currentTimeSelector = '.waveform__elapsed';

Connector.durationSelector = '.waveform__duration';

/**
 * Check if an album is playing.
 * @return {Boolean} Check result
 */
function isAlbum() {
	const label = Util.getTextFromSelectors(albumLabelSelector);
	if (label) {
		return label.includes('Album');
	}

	return false;
}

Connector.getTrackArt = () => {
	const trackArt = Util.extractImageUrlFromSelectors('.avatar-container img');
	if (trackArt && trackArt.includes('?')) {
		const endIdx = trackArt.indexOf('?');
		return trackArt.substr(0, endIdx);
	}

	return trackArt;
};
