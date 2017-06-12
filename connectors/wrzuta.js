'use strict';

/* global Connector, Util */

var DEFAULT_TRACK_ART_URL = 'http://c.wrzuta.pl/wi470/cbab02ab001342d756010226';

Connector.playerSelector = '#content';

Connector.isPlaying = function () {
	return $('.npp-container').hasClass('playing');
};

function setupPlaylistPlayer() {
	Connector.getArtistTrack = function() {
		var text = $('.playlist-position.active a.js-file-link').attr('title');
		return Util.splitArtistTrack(text);
	};

	Connector.getUniqueID = function() {
		return $('.playlist-position.active a.js-file-link').attr('data-key');
	};

	Connector.trackArtSelector = '.playlist-position.active .file-img';

	Connector.isTrackArtDefault = (url) => url !== DEFAULT_TRACK_ART_URL;

	Connector.durationSelector = '.playlist-position.active .position-time';
}

function setupVideoPlayer() {
	Connector.artistTrackSelector = '.js-file-title';

	Connector.getTrackArt = function() {
		return $('.npp-container video').attr('poster');
	};
}

function isPlaylistPlayer() {
	// Example: http://lalanablanalala91.wrzuta.pl/playlista/5WQ44bqPAR0/napszyklat_-_np_2009
	return $('#content .list-play').length > 0;
}

function isVideoPlayer() {
	// Example: http://noname925.wrzuta.pl/audio/60e3sP4UTY0/thomas_gold_feat._bright_lights_-_believe
	return $('#content .video-player').length > 0;
}

function setupConnector() {
	if (isVideoPlayer()) {
		setupVideoPlayer();
	} else if (isPlaylistPlayer()) {
		setupPlaylistPlayer();
	} else {
		console.log('WRZUTA connector: unknown player');
	}
}

setupConnector();
