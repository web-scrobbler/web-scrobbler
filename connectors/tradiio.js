'use strict';

/* global Connector, Util */

Connector.playerSelector = '.tradiio-music-player';

Connector.artistSelector = '.tradiio-music-player a.artist';

Connector.playButtonSelector = '.tradiio-music-player .section-controls .btn-play';

Connector.currentTimeSelector = '.tradiio-music-player .s-progress';

Connector.durationSelector = '.tradiio-music-player .s-total';

Connector.trackArtSelector = 'div.bgimge';

Connector.getTrack = function() {
	let songInfo = getSongInfo();
	return songInfo.track;
};

Connector.getAlbum = function() {
	let songInfo = getSongInfo();
	return songInfo.album;
};

function getSongInfo() {
	let albumTrack = $('.tradiio-music-player .musicname').text();
	let [album, track] = Util.splitString(albumTrack);

	return { album, track };
}
