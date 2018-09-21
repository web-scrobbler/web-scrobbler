'use strict';

Connector.playerSelector = '#controls';

Connector.artistTrackSelector = '#nowplaying_title > b';

Connector.trackArtSelector = '#nowplaying_title > img';

Connector.isPlaying = () => {
	return $('#play_button').hasClass('button_active');
}