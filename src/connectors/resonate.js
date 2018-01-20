'use strict';

if (location.host.startsWith('beta3')) {
	Connector.playerSelector = '#player';

	Connector.artistSelector = '#player .metas a';

	Connector.trackSelector = '#player .name';

	Connector.durationSelector = '.playlist-item--playing .duration';

	Connector.getTrackArt = () => {
		return $('.player-artwork > div').css('background-image').replace('url(', '').replace(')', '').replace(/"/gi, '');
	};

	Connector.trackArtSelector = '.current-cover';

	Connector.isPlaying = () => $('button.play-button').attr('aria-label') !== 'play';

} else {
	Connector.playerSelector = '#player-container';

	Connector.artistSelector = '.current-artist-name';

	Connector.trackSelector = '.current-song-name';

	Connector.durationSelector = '.duration-wrapper';

	Connector.getTrackArt = () => {
		return `${location.protocol}//${location.host}${$('.current-cover').attr('src')}`;
	};

	Connector.trackArtSelector = '.current-cover';

	Connector.isPlaying = () => $('.cover-container').hasClass('amplitude-playing');
}
