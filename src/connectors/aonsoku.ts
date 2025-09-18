export {};

Connector.playerSelector = '#root';

Connector.getTrack = () => navigator.mediaSession?.metadata?.title;

Connector.getArtist = () => navigator.mediaSession?.metadata?.artist;

Connector.playButtonSelector = '[data-testid="player-button-play"]';
