/**
 * Connector for Zing MP3 - https://zingmp3.vn
 */

export {};

const playerBar = '.player-controls__container'

const artistSelector = `${playerBar} .is-one-line.is-truncate.subtitle`;

const tractSelector = `${playerBar} .song-title-item`;

Connector.useMediaSessionApi();

Connector.playerSelector = playerBar;

Connector.artistSelector = artistSelector;

Connector.trackSelector = tractSelector;

Connector.trackArtSelector = '.thumbnail-wrapper .thumbnail .image';

Connector.currentTimeSelector = `${playerBar} .time.left`;

Connector.durationSelector = `${playerBar} .time.right`;

Connector.pauseButtonSelector = `${playerBar} .ic-pause-circle-outline`;

