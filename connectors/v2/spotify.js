'use strict';

/* global Connector */

Connector.getArtist = function() {
	return $('#main').contents().find('#miniplayer .metadata .artist').text() || null;
};

Connector.getTrack = function() {
	return $('#main').contents().find('#miniplayer .metadata .title').text() || null;
};

Connector.getDuration = function() {
	return Connector.stringToSeconds($('#main').contents().find('#remaining').text()) || null;
};

Connector.getCurrentTime = function() {
	return Connector.stringToSeconds($('#main').contents().find('#elapsed').text());
};

Connector.isPlaying = function() {
	return $('#main').contents().find('#play').hasClass('playing');
};

Connector.getTrackArt = function() {
	var backgroundStyle = $('#main').contents().find('.cover-image').css('background-image');
	if (!backgroundStyle) {
		return null;
	}
	return backgroundStyle.replace('url(', '').replace(')', '');
};

Connector.getUniqueID = function() {
	return $('#main').contents().find('.text .track a:first').attr('data-uri') || null;
};

var onPlayerLoaded = function() {
	var observer = new MutationObserver(Connector.onStateChanged);
	var observeTarget = $('#main').get(0).contentDocument.querySelector('footer');
	var config = {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true
	};
	observer.observe(observeTarget, config);
};

// wait for player to load
$('#main').on('load', onPlayerLoaded);
