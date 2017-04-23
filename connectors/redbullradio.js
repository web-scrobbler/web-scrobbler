'use strict';

/* global Connector */

Connector.playerSelector = '.c-player';

Connector.getTrack = function() {

	// Some shows have individual track listings - try to find this first
	var $artistTrack = $('.c-player .c-player__details .c-player__track > h3');

	if ($artistTrack) {
		return $artistTrack.text().split(' – ')[1];
	}

	return $('.c-episode h1.c-episode__title').text();
};

Connector.albumSelector = '.c-episode h1.c-episode__show-title';

Connector.playButtonSelector = '.c-player__controls .c-player__buttons .c-control span[role="button"]';

Connector.getArtist = function() {

	var artist = '';

	// Some shows have individual track listings - try to find this first
	var $artistTrack = $('.c-player .c-player__details .c-player__track > h3');

	if ($artistTrack) {
		return $artistTrack.text().split(' – ')[0];
	}

	// Pull artist out of Show title if we don't have individual track listings'
	switch (this.getAlbum()) {
		// Main stage title format is "[Artist] at [Venue]"
		case 'Main Stage':
			artist = this.getTrack().split(' at ')[0];
			break;
		default:
			artist = this.getTrack();
			break;
	}

	return artist;
};

Connector.getDuration = function () {
	var $progressControl = $('.c-player__controls > .c-player__progress > progress');
	var duration = 0;
	if ($progressControl) {
		try {
			duration = parseInt($progressControl.attr('max'));
		} catch (NumberFormatException) {
			duration = 0;
		}
	}
	return duration;
};


Connector.isPlaying = function () {
	var playing = false;

	var $playButton = $('.c-player .c-player__controls .c-player__buttons > div.c-control > span[role="button"] > svg > title');
	if ($playButton) {
		playing = $playButton.innerHTML !== 'Play';
	}
	return playing;
};
