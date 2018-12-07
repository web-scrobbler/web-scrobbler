'use strict';

if (location.host.startsWith('beta')) {
	Connector.playerSelector = '#player';

	Connector.artistSelector = '#player .track-artist';

	Connector.trackSelector = '#player .track-name';

	Connector.albumSelector = '#player .track-album';

	Connector.durationSelector = '.playlist-item--playing .duration';

	Connector.getTrackArt = () => {
		return Util.extractUrlFromCssProperty('.player-artwork > div');
	};

	Connector.isPlaying = () => $('button.play-button').attr('aria-label') !== 'play';
} else {
	Connector.playerSelector = '#player-container';

	Connector.artistSelector = '.current-artist-name';

	Connector.trackSelector = '.current-song-name';

	Connector.durationSelector = '.duration-wrapper';

	Connector.getTrackArt = () => {
		return `${location.protocol}//${location.host}${$('.current-cover').attr('src')}`;
	};

	Connector.isPlaying = () => $('.cover-container').hasClass('amplitude-playing');
}
