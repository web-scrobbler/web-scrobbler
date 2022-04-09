'use strict';

Connector.playerSelector = '#radio_playing_now';

Connector.artistSelector = '#radio_playing_now > .media-body > h5 > span';

Connector.trackSelector =
	'#radio_playing_now > .media-body h5 > span:nth-child(3)';

Connector.isPlaying = () => {
	return $('#player1').hasClass('jw-state-playing');
};
