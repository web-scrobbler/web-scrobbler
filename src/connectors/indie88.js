'use strict';

function setupConnector() {
	if (isCobrPlayer()) {
		setupCobrPlayer();
	} else {
		setupWebsitePlayer();
	}
}

function isCobrPlayer() {
	return document.querySelector('article.cobrp-page') !== null;
}

function setupCobrPlayer() {
	Connector.playerSelector = 'div.cobrp-player-main';
	Connector.trackSelector = 'div.cobrp-player-song';
	Connector.artistSelector = 'div.cobrp-player-artist';
	Connector.isPlaying = () => {
		return Util.hasElementClass(
			'img.cobrp-player-footer-icon',
			'mod-pause'
		);
	};
}

// Indie88 has the track and artist flipped on their main web player. The values are intentionally flipped in setupWebsitePlayer
function setupWebsitePlayer() {
	Connector.playerSelector = 'div.mediaplayer-mainbody';
	Connector.artistSelector = 'p#track-info-title span';
	Connector.trackSelector = 'p#track-info-artist span';
	Connector.isPlaying = () => {
		return Util.hasElementClass('a.btn-stop', 'hidden');
	};
}

setupConnector();
