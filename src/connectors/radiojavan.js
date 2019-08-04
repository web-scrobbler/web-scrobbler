'use strict';

Connector.playerSelector = 'div.webPlayer';

Connector.artistSelector = '.mainPanel .artist';

Connector.albumSelector = '.mainPanel .album';

Connector.trackSelector = '.mainPanel .song';

Connector.playButtonSelector = '.playIcon';

Connector.currentTimeSelector = '#mp3_position';

Connector.durationSelector = '#mp3_duration';

Connector.trackArtSelector = '.mainPanel .artwork > img';

Connector.isPlaying = () => {
	return $('.playIcon').hasClass('musicPause');
};
