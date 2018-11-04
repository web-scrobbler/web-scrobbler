'use strict';

if ($('body').hasClass('ng-tns-0-0')) {
	setupNewPlayer();
} else {
	setupMainPlayer();
}


function setupNewPlayer() {
	Connector.playerSelector = '.content-wrapper';

	Connector.artistSelector = '.song_info_display div:first-child b';

	Connector.trackSelector = '.song_info_display div:nth-child(2) b';

	Connector.albumSelector = '.song_info_display div:nth-child(3) b';

	Connector.isPlaying = () => $('#play-button').hasClass('active');

	Connector.getTrackArt = () => {
		return `${$('#info .cover a').find('img').attr('src')}`;
	};
}

function setupMainPlayer() {

	Connector.playerSelector = '#header';

	Connector.artistTrackSelector = '#nowplaying_title > b';

	Connector.trackArtSelector = '#nowplaying_title > img';

	Connector.isPlaying = () => $('#play_button').hasClass('button_active');
}
