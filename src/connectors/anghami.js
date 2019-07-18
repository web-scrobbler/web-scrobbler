'use strict';

Connector.artistSelector = '.action-artist';

Connector.trackSelector = '.action-title';

Connector.playerSelector = '.player-wrapper';

Connector.trackArtSelector = '.track-coverart';

Connector.isPlaying = () => {
	const buttonHref = $('.play-pause-cont .show use').attr('xlink:href');
	return buttonHref && buttonHref.includes('pause');
};
