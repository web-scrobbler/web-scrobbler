'use strict';

Connector.playerSelector = 'div.cobrp-player-main, div.mediaplayer-mainbody';

Connector.artistSelector = 'div.cobrp-player-main div.cobrp-player-artist, div.mediaplayer-mainbody .mediaplayer-snp p#track-info-artist';

Connector.trackSelector = 'div.cobrp-player-main .cobrp-player-song, div.mediaplayer-mainbody .mediaplayer-snp p#track-info-title';

Connector.onReady = Connector.onStateChanged;
