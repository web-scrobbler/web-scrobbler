'use strict';

/* global Connector */

Connector.playerSelector = '.l-music__player';

Connector.getTrack = function() {
	var trackNameString = $('.l-music__player__song__name').text();
	return $.trim(trackNameString);
};

Connector.getArtist = function() {
	var artistNameString = $('.l-music__player__song__author').text();
	return $.trim(artistNameString);
};

Connector.isPlaying = function () {
	return $('.l-music__player').hasClass('playing');
};

Connector.getTrackArt = function () {
	var coverArtURL = $('.l-music__player__song__cover').css('background-image');
	var regexp = /https?%3A\S*jpg/i;
	var coverArtURLClean = regexp.exec(coverArtURL);
	var coverArtURLstring = coverArtURLClean.toString();
	coverArtURLstring = coverArtURLstring.replace(/%3a/gi, ':');
	coverArtURLstring = coverArtURLstring.replace(/%2f/gi, '/');
	return coverArtURLstring;
};
