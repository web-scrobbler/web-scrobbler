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

var getSongInfo = function() {
	var album_track = $('.tradiio-music-player .musicname').text();
	if (album_track === null) {
		return null;
	}

	var separator = Util.findSeparator(album_track);

	var album = null;
	var track = null;

	if (separator !== null) {
		album = album_track.substr(0, separator.index);
		track = album_track.substr(separator.index + separator.length);
	} else {
		track = album_track;
	}

	return {album: album, track: track};
};
