'use strict';

/* global Connector */

Connector.playerSelector = '#music-player';

Connector.getArtist = function() {
	return $('#ArtistNameArea').text();
};

Connector.getTrack = function() {
	return $('#SongTitleArea').text();
};

Connector.getDuration = function() {
	var playTime = $('#playTime strong').text();
	return Connector.stringToSeconds(playTime.trim());
};

Connector.getCurrentTime = function() {
	var playTime = $('#playTime span').text();
	return Connector.stringToSeconds(playTime.trim());
};

Connector.isPlaying = function() {
	var btn = $('#PlayBtnArea')[0];
	return btn.classList.contains('pause'); // if "pause" string in button, it means now playing.
};

Connector.getTrackArt = function() {
	return 'http:'+$('#AlbumImgArea').find('img').attr('src');
};

var onPlayerLoaded = function() {
	console.log('Web Scrobbler: player loaded, setting up observer');
	var observer = new MutationObserver(Connector.onStateChanged);
	var observeTarget = $('#music-player');
	var config = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true
	};
	observer.observe(observeTarget, config);
};

// wait for player to load
$('#music-player').on('load', onPlayerLoaded);
