'use strict';

/* global Connector */

Connector.playerSelector = '.global-content';

Connector.isPlaying = function () {
	return $('.player-buttonPause').length ||
			$('.Artist-Mini-Playing').length ||
			$('.Artist-Maximus-Playing').length ||
			$('.Hello-Mini-Playing').length ||
			($('#PlayerFrame iframe').contents().find('#Play').length ? //embed
					$('#PlayerFrame iframe').contents().find('#Play').attr('src').indexOf('pause') !== -1 :
					false);
};

Connector.getArtistTrack = function () {
	var artist = null;
	var track = null;

	if ($('#PlayerFrame iframe').contents().find('#Play').length ? //embed
			$('#PlayerFrame iframe').contents().find('#Play').attr('src').indexOf('pause') !== -1 :
			false) { //embed
		artist = $('.H-artist').text();
		track = $('#PlayerFrame iframe').contents().find('#PlayerPanel > :first-child').text();
	} else if ($('.player-buttonPause').length) {
		var text = $('.player:has(.player-buttonPause) .player-name span').text();
		var separator = this.findSeparator(text);

		if (separator !== null) {
			artist = text.substr(0, separator.index);
			track = text.substr(separator.index + separator.length);
		}
	} else if ($('.Hello-Mini-Playing').length) {
		artist = $('.H-artist').text();
		track = $('.Hello-Mini-Playing').attr('title');
	} else {
		artist = $('.AR-wrap:has(.Artist-Mini-Playing) .AR-name').text() ||
				$(':has(.Artist-Mini-Playing) > div > .Artist-link').text() ||
				$('.A-wrap:has(.Artist-Maximus-Playing) .AR-name').text();

		track = $('.Artist-Mini-Playing').attr('title') ||
				$('.Artist-Maximus-Playing').attr('title');
	}

	return {artist: artist, track: track};
};
Connector.getAlbum = function () {
	return $('#PlayerFrame iframe').contents().find('#Play').length ? //embed
			$('#TrackList h1').text() :
			$('.Release-preview:has(.Hello-Mini-Playing) .Release-select strong').text() || null;
};
