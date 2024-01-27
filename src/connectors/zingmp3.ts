export {};

const playerBar = '.player-controls__container';

Connector.useMediaSessionApi();

Connector.playerSelector = playerBar;

Connector.artistSelector = `${playerBar} .is-one-line.is-truncate.subtitle`;

Connector.trackSelector = `${playerBar} .song-title-item`;

Connector.trackArtSelector = '.thumbnail-wrapper .thumbnail .image';

Connector.currentTimeSelector = `${playerBar} .time.left`;

Connector.durationSelector = `${playerBar} .time.right`;

Connector.pauseButtonSelector = `${playerBar} .ic-pause-circle-outline`;
