'use strict';

/* global Connector, Util */

Connector.playerSelector = '.tradiio-music-player';

Connector.artistSelector = '.tradiio-music-player a.artist';

Connector.playButtonSelector = '.tradiio-music-player .section-controls .btn-play';

Connector.currentTimeSelector = '.tradiio-music-player .s-progress';

Connector.durationSelector = '.tradiio-music-player .s-total';

Connector.trackArtImageSelector = 'div.bgimge';

Connector.getTrack = function() {
	var songInfo = getSongInfo();
	return songInfo[INFO_TRACK];
};

Connector.getAlbum = function() {
	var songInfo = getSongInfo();
	return songInfo[INFO_ALBUM];
};

var INFO_ALBUM = 'album';
var INFO_TRACK = 'track';

function getSongInfo() {
	var albumTrack = $('.tradiio-music-player .musicname').text();
	if (albumTrack === null) {
		return null;
	}

	var separator = Util.findSeparator(albumTrack);

	var album = null;
	var track = null;

	if (separator !== null) {
		album = albumTrack.substr(0, separator.index);
		track = albumTrack.substr(separator.index + separator.length);
	} else {
		track = albumTrack;
	}

	return { album, track };
}
