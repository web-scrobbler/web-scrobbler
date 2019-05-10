'use strict';

Connector.playerSelector = '.ctl';

Connector.artistSelector = '#newPlayerArtistName';

Connector.trackSelector = '.tracktitle > a';

Connector.getAlbum = () => {
	return $('.albumtitle').attr('title');
};

Connector.currentTimeSelector = '.start';

Connector.durationSelector = '.finish';

Connector.isPlaying = () => {
	return $('.btnStop').length !== 0;
};

Connector.trackArtSelector = '.thumbnail img';
