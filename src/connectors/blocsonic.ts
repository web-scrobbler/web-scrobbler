export {};

Connector.playerSelector = '#bloc-player-audio-container+div';

Connector.pauseButtonSelector = `${Connector.playerSelector} button[aria-label="Click to Play"]`;

Connector.trackSelector = `${Connector.playerSelector} h2>strong`;

Connector.artistSelector = `${Connector.playerSelector} h2>a`;

Connector.timeInfoSelector = '[class*=_PlayerTime_]';

Connector.trackArtSelector = `${Connector.playerSelector} img`;

Connector.albumSelector = `${Connector.playerSelector} h3>a`;
