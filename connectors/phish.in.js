'use strict';

Connector.playerSelector = '#player_container';

Connector.playButtonSelector = '#control_playpause';

Connector.isPlaying = function () {
	return $('#control_playpause').hasClass('playing');
};

Connector.getArtist = function () {
	return 'Phish';
};

Connector.trackSelector = '#player_title';

Connector.albumSelector = '#player_detail';
