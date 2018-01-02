'use strict';

Connector.playerSelector = '.global-content';

Connector.isPlaying = () => {
	return $('.player-buttonPause').length ||
		$('.Artist-Mini-Playing').length ||
		$('.Artist-Maximus-Playing').length ||
		$('.Hello-Mini-Playing').length ||

		($('#PlayerFrame iframe').contents().find('#Play').length &&
		$('#PlayerFrame iframe').contents().find('#Play').attr('src').includes('pause'));
};

Connector.getArtistTrack = () => {
	let artist = null;
	let track = null;

	if ($('#PlayerFrame iframe').contents().find('#Play').length &&
		$('#PlayerFrame iframe').contents().find('#Play').attr('src').includes('pause')) { // embed
		artist = $('.H-artist').text();
		track = $('#PlayerFrame iframe').contents().find('#PlayerPanel > :first-child').text();
	} else if ($('.player-buttonPause').length) {
		let text = $('.player:has(.player-buttonPause) .player-name span').text();
		let separator = Util.findSeparator(text);

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

	return { artist, track };
};
Connector.getAlbum = () => {
	return $('#PlayerFrame iframe').contents().find('#Play').length ? // embed
	$('#TrackList h1').text() :
		$('.Release-preview:has(.Hello-Mini-Playing) .Release-select strong').text();
};
