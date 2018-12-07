'use strict';

Connector.playerSelector = '#player-kodi';

Connector.artistSelector = `${Connector.playerSelector} .playing-subtitle`;

Connector.trackSelector = `${Connector.playerSelector} .playing-title`;

Connector.currentTimeSelector = `${Connector.playerSelector} .playing-time-current`;

Connector.durationSelector = `${Connector.playerSelector} .playing-time-duration`;

Connector.isPlaying = () => $('body').hasClass('kodi-playing');
