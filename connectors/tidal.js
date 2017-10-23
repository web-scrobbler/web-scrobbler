'use strict';

Connector.playerSelector = '#player';

Connector.trackArtSelector = '.js-footer-player-image';

Connector.trackSelector = `${Connector.playerSelector} [data-bind="title"]`;

Connector.artistSelector = `${Connector.playerSelector} [data-bind="artist"] a:first`;

Connector.playButtonSelector = `${Connector.playerSelector} .play-controls__play`;

Connector.currentTimeSelector = '.js-progress';

Connector.durationSelector = '.js-duration';
