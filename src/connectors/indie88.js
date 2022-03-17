'use strict';

function setupConnector() {
	if (isCobrPlayer()) {
		setupCobrPlayer();
	} else {
		setupWebsitePlayer();
	}
}

function isCobrPlayer() {
	return document.querySelector('div.cobrp-page-column') !== null;
}

function setupCobrPlayer() {
	Connector.playerSelector = 'div.cobrp-player';
	Connector.trackSelector = 'div.cobrp-player-song';
	Connector.artistSelector = 'div.cobrp-player-artist';
	Connector.isPlaying = () => $('img.cobrp-player-footer-icon').hasClass('mod-pause');
}

// Indie88 has the track and artist flipped on their main web player. The values are intentionally flipped in setupWebsitePlayer
function setupWebsitePlayer() {
	Connector.playerSelector = 'div.mediaplayer';
	Connector.artistSelector = 'p#track-info-title span';
	Connector.trackSelector = 'p#track-info-artist span';
	Connector.isPlaying = () => $('a.btn-play').hasClass('hidden');
}

setupConnector();
