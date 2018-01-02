'use strict';

Connector.playerSelector = '#player-controls';

Connector.artistTrackSelector = '.current-track-title > span';

Connector.currentTimeSelector = '#current-progress';

Connector.isPlaying = () => {
	return $('div.controls > i.fa.fa-play').hasClass('fa-pause');
};

Connector.getUniqueID = () => {
	return $('#current-track > div.current-track-title > span').attr('href');
};
