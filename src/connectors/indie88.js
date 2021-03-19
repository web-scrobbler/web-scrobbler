'use strict';

// Indie88 has the track and artist flipped on their main web player. The values are intentionally flipped in this Connector

Connector.playerSelector = 'div.cobrp-player-main, div.mediaplayer-mainbody';

Connector.artistSelector = 'div.cobrp-player-main div.cobrp-player-artist, div.mediaplayer-mainbody .mediaplayer-snp p#track-info-title span';

Connector.trackSelector = 'div.cobrp-player-main .cobrp-player-song, div.mediaplayer-mainbody .mediaplayer-snp p#track-info-artist span';

Connector.onReady = Connector.onStateChanged;
