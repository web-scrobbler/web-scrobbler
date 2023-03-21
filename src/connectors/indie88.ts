export {};

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
	Connector.isPlaying = () =>
		Util.hasElementClass('img.cobrp-player-footer-icon', 'mod-pause');
}

// Indie88 has the track and artist flipped on their main web player. The values are intentionally flipped in setupWebsitePlayer
function setupWebsitePlayer() {
	Connector.playerSelector = 'div.mediaplayer';
	Connector.artistSelector = 'p#track-info-title span';
	Connector.trackSelector = 'p#track-info-artist span';
	Connector.isPlaying = () => Util.hasElementClass('a.btn-play', 'hidden');
}

setupConnector();
