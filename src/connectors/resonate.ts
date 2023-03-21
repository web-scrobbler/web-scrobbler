export {};

Connector.playerSelector = '.player-component';

Connector.artistSelector = `${Connector.playerSelector} .track-artist`;

Connector.trackSelector = `${Connector.playerSelector} .track-title`;

Connector.currentTimeSelector = `${Connector.playerSelector} .currentTime`;

Connector.durationSelector = `${Connector.playerSelector} .duration`;

Connector.playButtonSelector = '.play-button svg.icon-play';
