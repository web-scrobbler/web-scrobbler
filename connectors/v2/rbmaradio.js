'use strict';

/* global Connector */

Connector.playerSelector = '.c-player';

Connector.trackSelector = '.c-episode h1.c-episode__title';

Connector.albumSelector = '.c-episode h1.c-episode__show-title';

Connector.playButtonSelector = '.c-player__controls .c-player__buttons .c-control span[role="button"]';

Connector.trackArtImageSelector = '.c-episode .c-episode__image div.c-image--cover > img';

Connector.getArtist = function() {

	var artist = '';

	// Pull artist out of track name
	switch (this.getAlbum()) {
		// Main stage title format is "[Artist] at [Venue]"
		case "Main Stage":
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
	var duration = '';
	if ($progressControl) {
		duration = $progressControl.attr('max'); 
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
