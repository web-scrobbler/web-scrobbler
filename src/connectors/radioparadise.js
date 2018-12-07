'use strict';

if ($('body').hasClass('ng-tns-0-0')) {
	setupNewPlayer();
} else {
	setupMainPlayer();
}

function setupNewPlayer() {
	Connector.playerSelector = '.content-wrapper';

	Connector.albumSelector = '.now_playing_list.ng-star-inserted:not(.dim) .title .album';

	Connector.getArtistTrack = () => {
		let text = document.title;
		return Util.splitArtistTrack(text);
	};

	Connector.isPlaying = () => $('#play-button').hasClass('active');

	Connector.trackArtSelector = '.now_playing_list.ng-star-inserted:not(.dim) img';
}

function setupMainPlayer() {
	Connector.playerSelector = '#header';

	Connector.artistTrackSelector = '#nowplaying_title > b';

	Connector.trackArtSelector = '#nowplaying_title > img';

	Connector.isPlaying = () => $('#play_button').hasClass('button_active');
}
