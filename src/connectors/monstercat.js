'use strict';

const playerBar = '.controls';

Connector.playerSelector = playerBar;

Connector.artistTrackSelector = `${playerBar} .scroll-title`;

Connector.pauseButtonSelector = `${playerBar} .fa-pause`;

Connector.useMediaSessionApi();
