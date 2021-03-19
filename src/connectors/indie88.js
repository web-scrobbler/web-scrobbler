'use strict';

// Indie88 has the track and artist flipped on their main web player. The values are intentionally flipped in this Connector

Connector.playerSelector = [
				'div.cobrp-player-main',
				'div.mediaplayer-mainbody',
];

Connector.artistSelector = [
				'div.cobrp-player-artist',
				'p#track-info-title span',
];

Connector.trackSelector = [
				'.cobrp-player-song',
				'p#track-info-artist span',
];
