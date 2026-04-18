export {};

Connector.playerSelector = 'zx-player .player-bar';

// supported languages on the website at time of writing the connector:
// - russian
// - english
// - spanish
Connector.playButtonSelector = [
	`${Connector.playerSelector} button[aria-label="Играть"]`,
	`${Connector.playerSelector} button[aria-label="Play"]`,
	`${Connector.playerSelector} button[aria-label="Reproducir"]`,
];
Connector.pauseButtonSelector = [
	`${Connector.playerSelector} button[aria-label="Пауза"]`,
	`${Connector.playerSelector} button[aria-label="Pause"]`,
	`${Connector.playerSelector} button[aria-label="Pausa"]`,
];

Connector.artistTrackSelector = `${Connector.playerSelector} .player-progress-text`;
