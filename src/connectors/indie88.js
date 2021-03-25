'use strict';

// Indie88 has the track and artist flipped on their main web player. The values are intentionally flipped in this Connector

function setupConnector() {
	if (isCobrPlayer()) {
		setupCobrPlayer();
	} else {
		setupWebsitePlayer();
	}
}

function isCobrPlayer() {
	return $('article.cobrp-page').length > 0;
}

function setupCobrPlayer() {
	Connector.playerSelector = 'div.cobrp-player-main';
	Connector.trackSelector = 'div.cobrp-player-song';
	Connector.artistSelector = 'div.cobrp-player-artist';
}

function setupWebsitePlayer() {
	Connector.playerSelector = 'div.mediaplayer-mainbody';
	Connector.artistSelector = 'p#track-info-title span';
	Connector.trackSelector = 'p#track-info-artist span';
}

setupConnector();
