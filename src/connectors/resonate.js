'use strict';

Connector.playerSelector = '#player-container';

Connector.artistSelector = '.current-artist-name';

Connector.trackSelector = '.current-song-name';

Connector.durationSelector = '.duration-wrapper';

Connector.getTrackArt = () => {
	return `${location.protocol}//${location.host}${$('.current-cover').attr('src')}`;
};

Connector.trackArtSelector = '.current-cover';

Connector.isPlaying = () => $('.cover-container').hasClass('amplitude-playing');
