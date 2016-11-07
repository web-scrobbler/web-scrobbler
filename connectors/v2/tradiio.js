'use strict';

/* global Connector */

Connector.playerSelector = '.tradiio-music-player';

Connector.artistSelector = '.tradiio-music-player a.artist';

Connector.playButtonSelector = '.tradiio-music-player .section-controls .btn-play';

Connector.currentTimeSelector = '.tradiio-music-player .s-progress';

Connector.durationSelector = '.tradiio-music-player .s-total';

Connector.getTrack = function() {
	var songInfo = getSongInfo();
	return songInfo[INFO_TRACK];
};

Connector.getAlbum = function() {
	var songInfo = getSongInfo();
	return songInfo[INFO_ALBUM];
};

Connector.getTrackArt = function() {
	var backgroundStyle = $('div.bgimge').css('background'),
		backgroundUrl = /url\((['"]?)(.*)\1\)/.exec(backgroundStyle);
	return backgroundUrl ? backgroundUrl[2] : null;
};

var INFO_ALBUM = 'album';
var INFO_TRACK = 'track';

var getSongInfo = function() {
	var album_track = $('.tradiio-music-player .musicname').text();
	if (album_track === null) {
		return null;
	}

	var separator = Connector.findSeparator(album_track);

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
