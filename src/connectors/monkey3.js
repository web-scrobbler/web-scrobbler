'use strict';

Connector.playerSelector = '#webplayer';

Connector.artistSelector = () => {
	return $('#webplayer #crnt_artist').attr('value');
};

Connector.trackSelector = () => {
	return $('#webplayer #crnt_title').attr('value');
};

Connector.isPlaying = () => {
	return $('#crtl1').attr('class') !== 'resume';
};

Connector.getTrackArt = () => {
	return $('.albumview .cover .img').find('img').attr('src');
};
