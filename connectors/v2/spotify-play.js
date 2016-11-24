'use strict';

/* global Connector, MetadataFilter */

Connector.getArtist = function() {
	return $('#app-player').contents().find('#track-artist a').first().text();
};

Connector.getTrack = function() {
	return $('#app-player').contents().find('#track-name a').first().text();
};

Connector.getDuration = function() {
	var el = $('#app-player').get(0).contentDocument.getElementById('track-length');
	if (el === null) {
		return null;
	}

	return Connector.stringToSeconds(el.textContent);
};

Connector.getCurrentTime = function() {
	var el = $('#app-player').get(0).contentDocument.getElementById('track-current');
	if (el === null) {
		return null;
	}

	return Connector.stringToSeconds(el.textContent);
};

Connector.isPlaying = function() {
	var btn = $('#app-player').get(0).contentDocument.getElementById('play-pause');
	if (btn === null) {
		return false;
	}

	return btn.classList.contains('playing');
};

Connector.getTrackArt = function() {
	var backgroundStyle = $('#app-player').contents().find('.sp-image-img').css('background-image'),
		backgroundUrl = /^url\((['"]?)(.*)\1\)$/.exec(backgroundStyle);
	return backgroundUrl ? backgroundUrl[2] : null;
};

Connector.filter = MetadataFilter.getRemasteredFilter();

var onPlayerLoaded = function() {
	console.log('Web Scrobbler: player loaded, setting up observer');
	var observer = new MutationObserver(Connector.onStateChanged);
	var observeTarget = $('#app-player').get(0).contentDocument.getElementById('wrap');
	var config = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true
	};
	observer.observe(observeTarget, config);
};

// wait for player to load
$('#app-player').on('load', onPlayerLoaded);
