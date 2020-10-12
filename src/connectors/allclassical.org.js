'use strict';

Connector.playerSelector = '#live';

Connector.trackSelector = '#title';

Connector.artistSelector = '#composer';

Connector.playButtonSelector = '#live-play';

Connector.isScrobblingAllowed = () => document.querySelector('.nowplaying-label').textContent === 'Now Playing';
