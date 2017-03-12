'use strict';

/* global Connector, Util */

Connector.playerSelector = '.tradiio-music-player';

Connector.artistSelector = '.tradiio-music-player a.artist';

Connector.playButtonSelector = '.tradiio-music-player .section-controls .btn-play';

Connector.currentTimeSelector = '.tradiio-music-player .s-progress';

Connector.durationSelector = '.tradiio-music-player .s-total';

Connector.trackArtImageSelector = 'div.bgimge';

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
	if (albumTrack === null) {
		return null;
	}

	let separator = Util.findSeparator(albumTrack);

	let album = null;
	let track = null;

	if (separator !== null) {
		album = albumTrack.substr(0, separator.index);
		track = albumTrack.substr(separator.index + separator.length);
	} else {
		track = albumTrack;
	}

	return { album, track };
}
